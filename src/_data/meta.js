module.exports = {
  url: process.env.URL || 'http://localhost:8080',
  environment: process.env.ELEVENTY_ENV,
  nav: [
    {
      text: 'Home',
      href: '/'
    },
    {
      text: 'SolidJS',
      href: '/solid/'
    },
    {
      text: 'WebC',
      href: '/webc/'
    },
    {
      text: 'Islands',
      href: '/islands/'
    }
  ]
}
