import {UpdatePageResponse} from "@notionhq/client/build/src/api-endpoints"
import {getNotionPageId} from "./utils"


export default function updateWhenClosed() {
  const notionPageId = getNotionPageId()

  if (notionPageId)
    updateNotionBlock(notionPageId).then(() => {
    })
}

async function updateNotionBlock(notionPageId: string) {
  const {Client} = require("@notionhq/client")
  const notion = new Client({auth: process.env["NOTION_KEY"]})

  const response: UpdatePageResponse = await notion.pages.update({
    page_id: notionPageId,
    properties: {
      "ステータス": {
        "select": {
          "name": "完了"
        }
      }
    }
  })
  console.log(response);
}
