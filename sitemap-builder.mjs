import fs from 'fs';
import pkg from 'react-router-sitemap';
const { sitemapBuilder: buildSitemap } = pkg;
import differenceInDays from 'date-fns/differenceInDays/index.js';

const paths = ['/', '/puzzles'];

const maxIndex = differenceInDays(new Date(), new Date('2022-01-20T00:00:00'));

Array.from(Array(maxIndex).keys()).forEach((_, index) => {
  paths.push('/puzzles/' + (index + 1));
});

const hostname = 'https://omtamil.com/sorputhir';

const sitemap = buildSitemap(hostname, paths).toXML();

fs.writeFile('./public/sitemap.xml', sitemap, err => {});
