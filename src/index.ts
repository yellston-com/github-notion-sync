import * as core from '@actions/core'
import updateWhenOpened from "./whenOpened"
import updateWhenClosed from "./whenClosed"

const action = core.getInput('notion-action');

try {
  switch (action) {
    case 'when_pull_request_opened':
      updateWhenOpened()
      break
    case 'when_pull_request_closed':
      updateWhenClosed()
      break
  }
} catch (err) {
  core.setFailed(err.message);
}
