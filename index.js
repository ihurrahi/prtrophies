function isMilestone(number) {
  return number > 1000 && number % 1000 === 0;
}

function milestoneBody(number) {
  return `Congratulations on opening PR #${number}! ![trophy](https://i.imgur.com/eKEDalI.png)`;
}

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.on(
    "pull_request.opened",
    async (context) => {
      const number = context.payload.number;
      let body = null;
      if (isMilestone(number)) {
        body = milestoneBody(number);
      }

      if (body) {
        const params = context.pullRequest({ body, event: 'COMMENT' });
        return context.octokit.pulls.createReview(params);
      }
    }
  );
};
