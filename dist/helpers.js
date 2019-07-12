'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ANY_SCRIPT = exports.ANY_SCRIPT = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
var EXTERNAL_SCRIPT = exports.EXTERNAL_SCRIPT = /<script[^>]+src=(['"])(.*?)\1/i;
var INJECTED_SCRIPT = exports.INJECTED_SCRIPT = /<script[\s\S]*?>[\s\S]*?createElement[\s\S]*?src\s?=\s?(['"])(.*?)\1/i;

/**
 * Find the URI for the external file loaded from a script tag.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of the requested external script, otherwise null.
 */
var extractExternalScriptURL = function extractExternalScriptURL(script) {
  var match = script.match(EXTERNAL_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Find the URI for a script being injected from inline JS.
 *
 * @param {String} script The string HTML of a <script> tag.
 * @returns {String|null} The URI of a script being injected from inline JS, otherwise null.
 */
var extractInjectedScriptURL = function extractInjectedScriptURL(script) {
  var match = script.match(INJECTED_SCRIPT);
  // Return null if no match, otherwise return the second capture group.
  return match && match[2];
};

/**
 * Match either external or inline-script-injected script tag source URIs.
 *
 * @param {String} script The string HTML of a <script> tag
 * @returns {String|null} The URI of the script file this script tag loads, or null.
 */
var extractScriptURL = function extractScriptURL(script) {
  return extractExternalScriptURL(script) || extractInjectedScriptURL(script);
};

/**
 * Remove duplicate or undefined values from an array of strings.
 *
 * @param {String[]} Array script file URIs.
 */
var uniqueURIs = function uniqueURIs(scripts) {
  return Object.keys(scripts.reduce(function (keys, script) {
    return script ? _extends({}, keys, _defineProperty({}, script, true)) : keys;
  }, {}));
};

/**
 * Parse a string of HTML and identify the JS files loaded by any contained script tags.
 *
 * @param {String} string String containing HTML markup which may include script tags.
 * @returns {String[]} Array of any script URIs we believe to be loaded in this HTML.
 */
var getScripts = exports.getScripts = function getScripts(string) {
  var scripts = string.match(/<script[\s\S]*?<\/script>/gi);
  return scripts ? uniqueURIs(scripts.map(extractScriptURL)) : [];
};

/**
 * Create & inject a new <script> tag into the page.
 *
 * @param {String} src A script URL.
 * @returns {HTMLElement} The injected script tag.
 */
var injectScriptTag = exports.injectScriptTag = function injectScriptTag(src) {
  var scriptTag = document.createElement('script');
  scriptTag.src = src;
  document.head.appendChild(scriptTag);
  return scriptTag;
};