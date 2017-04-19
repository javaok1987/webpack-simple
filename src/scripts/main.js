/* eslint no-unused-expressions: [2, { allowTernary: true }]*/

import styles from '../sass/main.scss';

if (module.hot) { // 支援 HMR.
  module.hot.accept()
}


jQuery(($) => {
  console.log(`jQuery version: ${$().jquery}`)
});
