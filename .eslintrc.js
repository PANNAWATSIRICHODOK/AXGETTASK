// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020, // รองรับ JavaScript สมัยใหม่
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential', // กฎพื้นฐานสำหรับ Vue
  ],
  plugins: [
    'vue' // รองรับการ lint ไฟล์ .vue
  ],
  rules: {
    // อนุญาต semicolons
    'semi': ['off'],
    // ปิดการเช็ค space ก่อนวงเล็บในฟังก์ชัน
    'space-before-function-paren': 'off',
    // อนุญาต trailing commas
    'comma-dangle': 'off',
    // อนุญาต console.log ในทุก environment
    'no-console': 'off',
    // ปิดการบังคับใช้ standard rules ที่เคร่งครัด
    'generator-star-spacing': 'off',
    'no-debugger': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    // อนุญาต async-await
    'require-await': 'off',
    'no-unused-vars': 'off' // เตือนเมื่อมีตัวแปรที่ไม่ได้ใช้ แต่ไม่ error
  }
}
