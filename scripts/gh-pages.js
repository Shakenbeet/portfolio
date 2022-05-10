var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        silent: true,
        repo: 'https://' + process.env.GITHUB_TOKEN + '@github.com:Shakenbeet/portfolio.git',
        user: {
            name: 'Luke Gobin',
            email: 'luke.gobin1@icloud.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)