"use strict";

const validators = require("../bin/validators");
const { inspect } = require("util");

expect.extend({
  toPass(validator, opts) {
    const pass = validator(opts);
    return {
      message: () =>
        `expected ${inspect(opts)} to be ${pass ? "invalid" : "valid"}`,
      pass
    };
  }
});

function rule(name, { valid, invalid }) {
  test(name, () => {
    const validator = validators[name];
    if (valid) {
      valid.forEach(opts => expect(validator).toPass(opts));
    }
    if (invalid) {
      invalid.forEach(opts => expect(validator).not.toPass(opts));
    }
  });
}

rule("curly", {
  valid: [[], , ["all"], ["multi"], ["multi", "consistent"]],
  invalid: [["multi-line"], ["multi-or-nest"], ["multi-line", "consistent"]]
});

rule("lines-around-comment", {
  valid: [
    [
      {
        allowBlockStart: true,
        allowBlockEnd: true,
        allowObjectStart: true,
        allowObjectEnd: true,
        allowArrayStart: true,
        allowArrayEnd: true
      }
    ]
  ],
  invalid: [
    [],
    [
      {
        allowBlockEnd: true,
        allowObjectStart: true,
        allowObjectEnd: true,
        allowArrayStart: true,
        allowArrayEnd: true
      }
    ],
    [null]
  ]
});

rule("no-confusing-arrow", {
  valid: [[], [{ allowParens: false }], [null]],
  invalid: [[{ allowParens: true }]]
});

rule("vue/html-self-closing", {
  valid: [
    [{ html: { void: "any" } }],
    [
      {
        html: {
          void: "any",
          html: "never",
          component: "never"
        },
        svg: "never",
        math: "never"
      }
    ]
  ],
  invalid: [[], [null], [{ html: null }], [{ html: { void: "always" } }]]
});
