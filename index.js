function isMilestone(number) {
  return number > 1000 && number % 1000 === 0;
}

function milestoneBody(number) {
  return `Congratulations on opening PR #${number}! ![trophy](https://image.shutterstock.com/image-vector/trophy-cup-award-vector-icon-260nw-592525184.jpg)`;
}

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.on(
    "pull_request.opened",
    async (context) => {
      app.log.info(context.payload);
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
