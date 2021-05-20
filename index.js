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
  // Your code here
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
