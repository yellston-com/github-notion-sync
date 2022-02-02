import {WebhookPayload} from "@actions/github/lib/interfaces"

export function getNotionPageId(): string {
  const body = getPullRequestBody()
  const urlReg: RegExpMatchArray | null = body.match(/(?:https|notion):\/\/www\.notion\.so\/(?:\S+-?|)(\w{32})/)
  if (urlReg && urlReg.length > 0) return urlReg[1]
  return ''
}

function pullRequestPayload(): WebhookPayload {
  const github = require("@actions/github")
  return github.context.payload.pull_request
}

export function getPullRequestBody(): string {
  const pullRequest: WebhookPayload = pullRequestPayload()
  if (!('body' in pullRequest)) return ''
  return pullRequest.body
}

export function getPullRequestUrl(): string {
  const pullRequest: WebhookPayload = pullRequestPayload()
  if (!('html_url' in pullRequest)) return ''
  return pullRequest.html_url
}
