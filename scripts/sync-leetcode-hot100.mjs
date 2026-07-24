import { writeFile } from 'node:fs/promises'

const GRAPHQL_URL = 'https://leetcode.cn/graphql/'
const PLAN_URL = 'https://leetcode.cn/studyplan/top-100-liked/'

const studyPlanQuery = `
  query studyPlanV2Detail($slug: String!) {
    studyPlanV2Detail(planSlug: $slug) {
      planSubGroups {
        name
        questions {
          questionFrontendId
          titleSlug
          translatedTitle
        }
      }
    }
  }
`

const questionQuery = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      translatedContent
    }
  }
`

const supplementalExamples = {
  146: [
    {
      input: '["LRUCache","put","get"]\n[[1],[1,1],[1]]',
      output: '[null,null,1]',
    },
    {
      input: '["LRUCache","put","put","get","get"]\n[[1],[1,1],[2,2],[1],[2]]',
      output: '[null,null,null,-1,2]',
    },
  ],
  155: [
    {
      input: '["MinStack","push","getMin","top"]\n[[],[5],[],[]]',
      output: '[null,null,5,5]',
    },
    {
      input: '["MinStack","push","push","pop","getMin"]\n[[],[2],[-1],[],[]]',
      output: '[null,null,null,null,2]',
    },
  ],
  208: [
    {
      input: '["Trie","insert","search","startsWith"]\n[[],["cat"],["cat"],["ca"]]',
      output: '[null,null,true,true]',
    },
    {
      input: '["Trie","insert","search","startsWith"]\n[[],["apple"],["app"],["app"]]',
      output: '[null,null,false,true]',
    },
  ],
  295: [
    {
      input: '["MedianFinder","addNum","findMedian"]\n[[],[5],[]]',
      output: '[null,null,5.0]',
    },
    {
      input: '["MedianFinder","addNum","addNum","findMedian"]\n[[],[2],[4],[]]',
      output: '[null,null,null,3.0]',
    },
  ],
}

async function graphql(query, variables, referer = PLAN_URL) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer,
      'user-agent': 'AlgoLens Hot 100 example synchronizer',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`LeetCode GraphQL request failed: ${response.status}`)
  }

  const payload = await response.json()
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '))
  }
  return payload.data
}

function htmlToText(html) {
  return html
    .replace(/<(?:br|\/p|\/div|\/li|\/pre)>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function parseIo(text) {
  const inputMatch = text.match(
    /输入\s*[:：]?\s*([\s\S]*?)(?=\n?\s*输出\s*[:：]?)/u,
  )
  const outputMatch = text.match(
    /输出\s*[:：]?\s*([\s\S]*?)(?=\n?\s*(?:解释|提示)\s*[:：]?|$)/u,
  )
  if (!inputMatch || !outputMatch) return null

  return {
    input: inputMatch[1].trim(),
    output: outputMatch[1].trim(),
  }
}

function parseExamples(html) {
  const text = htmlToText(html ?? '')
  const sections = text.split(/示例\s*\d+\s*[:：]?/u).slice(1)
  const examples = sections
    .map((section) => parseIo(section.split(/(?:^|\n)提示\s*[:：]?/u)[0]))
    .filter(Boolean)

  if (examples.length > 0) return examples.slice(0, 3)

  const preBlocks = [...(html ?? '').matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/gi)]
  return preBlocks
    .map((match) => parseIo(htmlToText(match[1])))
    .filter(Boolean)
    .slice(0, 3)
}

async function fetchInBatches(items, batchSize, task) {
  const result = []
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize)
    result.push(...(await Promise.all(batch.map(task))))
  }
  return result
}

const plan = await graphql(studyPlanQuery, { slug: 'top-100-liked' })
const questions = plan.studyPlanV2Detail.planSubGroups.flatMap((group) =>
  group.questions.map((question) => ({
    id: Number(question.questionFrontendId),
    slug: question.titleSlug,
    title: question.translatedTitle,
    category: group.name,
  })),
)

if (questions.length !== 100 || new Set(questions.map(({ id }) => id)).size !== 100) {
  throw new Error(`Expected 100 unique questions, received ${questions.length}`)
}

const synced = await fetchInBatches(questions, 10, async (question) => {
  const data = await graphql(
    questionQuery,
    { titleSlug: question.slug },
    `https://leetcode.cn/problems/${question.slug}/`,
  )
  const official = parseExamples(data.question.translatedContent).map(
    (example, index) => ({
      label: `示例 ${index + 1}`,
      ...example,
      source: 'leetcode',
    }),
  )
  const supplements = supplementalExamples[question.id] ?? []
  const examples = [...official]
  for (const supplement of supplements) {
    if (examples.length >= 3) break
    examples.push({
      label: `补充示例 ${examples.length + 1}`,
      ...supplement,
      source: 'supplement',
    })
  }

  if (examples.length < 2) {
    throw new Error(
      `LeetCode ${question.id} ${question.title} only produced ${examples.length} example(s)`,
    )
  }

  return [question.id, examples]
})

const records = Object.fromEntries(synced)
const file = `// Generated by scripts/sync-leetcode-hot100.mjs from LeetCode's public Hot 100 pages.\n` +
  `// Keep this file static at runtime so the visualizer remains a backend-free SPA.\n` +
  `import type { ProblemExample } from './types'\n\n` +
  `export const officialExamples: Record<number, readonly ProblemExample[]> = ${JSON.stringify(records, null, 2)}\n`

await writeFile(new URL('../src/catalog/officialExamples.ts', import.meta.url), file)
console.log(`Synced ${questions.length} problems and ${synced.reduce((sum, [, list]) => sum + list.length, 0)} examples.`)
