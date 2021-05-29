const fetch = require('node-fetch');

const { GA_TRACKING_ID } = process.env;

async function track(payload) {
  fetch(
    'https://www.google-analytics.com/collect',
    {
      method: "POST",
      body: `v=1&tid=${GA_TRACKING_ID}&uid=${payload.installation.account.id}&t=event&ec=App&ea=${payload.action}`,
    },
  ).then(async (response) => {
    if (!response.ok) {
      const body = await response.text();
      console.log(body);
    }
  })
}

function isMilestone(number) {
  return number > 1000 && number % 1000 === 0;
}

function milestoneBody(number) {
  return `Congratulations on opening PR #${number}!<br/><img src="https://i.imgur.com/eKEDalI.png" width="188" height="250" />`;
}

function isPalindrome(number) {
  return number > 1000 && String(number).split('').reverse().join('') === String(number);
}

function palindromeBody(number) {
  return `You got PR #${number}!<br/><img src="https://i.imgur.com/0dgiArs.png" width="188" height="250" />`;
}

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.on(
    "installation.created",
    async (context) => {
      track(context.payload);
    }
  );
  app.on(
    "pull_request.opened",
    async (context) => {
      const number = context.payload.number;
      let body = null;
      if (isMilestone(number)) {
        body = milestoneBody(number);
      } else if (isPalindrome(number)) {
        body = palindromeBody(number);
      }

      if (body) {
        const params = context.pullRequest({ body, event: 'COMMENT' });
        return context.octokit.pulls.createReview(params);
      }
    }
  );
};
