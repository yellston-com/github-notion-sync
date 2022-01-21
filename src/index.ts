import * as core from '@actions/core'
import {
  AppendBlockChildrenParameters,
  AppendBlockChildrenResponse,
  ListBlockChildrenResponse
} from "@notionhq/client/build/src/api-endpoints"
import {WebhookPayload} from "@actions/github/lib/interfaces"

const action = core.getInput('trello-action');

const {Client} = require("@notionhq/client")
const notion = new Client({auth: process.env["NOTION_KEY"]})

try {
  switch (action) {
    case 'update_notion_when_pull_request_opened':
      updateNotionWhenPullRequestOpen();
      break;
  }
} catch (err) {
  core.setFailed(err.message);
}


function updateNotionWhenPullRequestOpen() {
  const github = require("@actions/github")
  const pullRequest: WebhookPayload = github.context.payload.pull_request
  if (!(('html_url' in pullRequest) && ('body' in pullRequest))) return
  const pullRequestLink: string = pullRequest.html_url
  const body: string = pullRequest.body
  const notionUrl: RegExpMatchArray | null  = body.match(/https:\/\/www\.notion\.so\/\S+-(\w{32})/)

  if (notionUrl && notionUrl.length > 0)
    updateNotionBlock(pullRequestLink, notionUrl[1]).then(() => {
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
