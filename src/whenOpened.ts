import {
  AppendBlockChildrenParameters,
  AppendBlockChildrenResponse,
  ListBlockChildrenResponse
} from "@notionhq/client/build/src/api-endpoints"
import {getNotionPageId, getPullRequestUrl} from "./utils"

const {Client} = require("@notionhq/client")
const notion = new Client({auth: process.env["NOTION_KEY"]})


export default function updateWhenOpened() {
  const pullRequestLink: string = getPullRequestUrl()
  const notionPageId = getNotionPageId()

  if (notionPageId)
    updateNotionBlock(pullRequestLink, notionPageId).then(() => {
    })
}

async function updateNotionBlock(pullRequestLink: string, notionPageId: string) {
  const childBlockRes: ListBlockChildrenResponse = await notion.blocks.children.list({
    block_id: notionPageId
  })
  if (!('results' in childBlockRes)) return
  const results = childBlockRes.results

  if (!(results && results.length > 0)) return
  const firstChild = results[0]

  if (!('id' in firstChild)) return
  await appendGithubLink(firstChild.id, pullRequestLink)
}

async function appendGithubLink(blockId: string, pullRequestLink: string) {
  const appendBlock: AppendBlockChildrenParameters = {
    block_id: blockId,
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: pullRequestLink,
                link: {
                  url: pullRequestLink,
                }
              }
            }
          ]
        }
      }
    ]
  }

  const response: AppendBlockChildrenResponse = await notion.blocks.children.append(appendBlock)
  console.log(response);
}
