module.exports = {
  url: process.env.URL || 'http://localhost:8080',
  environment: process.env.ELEVENTY_ENV,
  nav: [
    {
      text: 'Home',
      href: '/'
    },
    {
      text: 'About',
      href: '/about/'
    },
    {
      text: 'Inline',
      href: '/inline/'
    },
    {
      text: 'Islands',
      href: '/island/'
    }
  ]
}
