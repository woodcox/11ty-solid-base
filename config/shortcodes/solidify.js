import esbuild from 'esbuild';
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false
import { solidPlugin } from 'esbuild-plugin-solid';
import fsPromises from 'fs.promises';


// Note: transform will not bundle!
module.exports = async (code) => {
  await fsPromises.writeFile('in.jsx', code),
  await esbuild.buildSync({ 
    entryPoints: ['in.jsx'],
    outfile: 'out.js',
    bundle: true,
    plugins: [solidPlugin()],
    minify: isProd.
    target: isProd ? 'es6' : 'esnext'
  })
  const jsbundle = await fsPromises.readFile('out.js', 'utf8')
  return await jsbundle 
};
