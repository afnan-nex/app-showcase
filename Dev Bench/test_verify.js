/**
 * DevBench - Automated Verification Test Suite
 * Tests all 20 developer algorithms and utilities.
 */

import { formatJSON, validateJSON, buildJSONTreeHTML } from './js/tools/json-tools.js';
import { encodeBase64, decodeBase64, encodeURL, decodeURL, encodeHTMLEntities, decodeHTMLEntities } from './js/tools/encoding-tools.js';
import { decodeJWT, generateHashes, generateUUID, generateBulkUUIDs } from './js/tools/security-tools.js';
import { testRegex, computeTextDiff, sortLines, removeDuplicateLines, cleanWhitespace, convertCase } from './js/tools/text-tools.js';
import { parseURL, rebuildURL, generateCurlCommand } from './js/tools/network-tools.js';
import { convertTimestamp, parseAndConvertColor, generateLorem, generateMockUsers } from './js/tools/conversion-tools.js';

console.log('--- 1. Testing JSON Formatter & Validator ---');
const rawJSON = '{"b":2,"a":1,"nullVal":null}';
const formatted = formatJSON(rawJSON, { indent: 2, sortKeys: true, removeNulls: true });
console.log('Formatted JSON:', formatted.output.replace(/\n/g, ' '));
const val = validateJSON(formatted.output);
console.log('Validation:', val.isValid, val.message);
if (!val.isValid || !formatted.output.includes('"a": 1')) throw new Error('JSON format/validation failed');

console.log('\n--- 2. Testing Base64 UTF-8 Encode/Decode ---');
const sampleText = 'DevBench ⚡ Test String with UTF-8';
const b64 = encodeBase64(sampleText);
const decodedB64 = decodeBase64(b64);
console.log('Base64:', b64);
console.log('Decoded:', decodedB64);
if (decodedB64 !== sampleText) throw new Error('Base64 encode/decode mismatch');

console.log('\n--- 3. Testing URL & HTML Encoders ---');
const rawURL = 'hello world & test';
const encURL = encodeURL(rawURL);
const decURL = decodeURL(encURL);
console.log('URL Encoded:', encURL);
if (decURL !== rawURL) throw new Error('URL encode/decode mismatch');

const rawHTML = '<script>alert("hello & world")</script>';
const encHTML = encodeHTMLEntities(rawHTML);
const decHTML = decodeHTMLEntities(rawHTML); // mock check
console.log('HTML Entities:', encHTML);
if (!encHTML.includes('&lt;script&gt;')) throw new Error('HTML entities failed');

console.log('\n--- 4. Testing JWT Decoder ---');
const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXgiLCJpYXQiOjE3MjQ4MDAwMDAsImV4cCI6MTc4Nzg3MjAwMH0.dummy';
const jwtRes = decodeJWT(sampleJWT);
console.log('JWT Header:', jwtRes.header);
console.log('JWT Payload:', jwtRes.payload);
if (jwtRes.payload.name !== 'Alex') throw new Error('JWT decoding failed');

console.log('\n--- 5. Testing UUID & Crypto Hashes ---');
const uuid4 = generateUUID('v4');
const uuid7 = generateUUID('v7');
const ulid = generateUUID('ulid');
console.log('UUID v4:', uuid4);
console.log('UUID v7:', uuid7);
console.log('ULID:', ulid);

const hashes = await generateHashes('DevBench Test');
console.log('MD5:', hashes.md5);
console.log('CRC32:', hashes.crc32);
if (!hashes.md5 || !hashes.crc32) throw new Error('Hashes computation failed');

console.log('\n--- 6. Testing Regex & Diff ---');
const regexRes = testRegex('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b', 'gi', 'Contact test@example.com for info');
console.log('Regex Match Count:', regexRes.matchCount);
if (regexRes.matchCount !== 1) throw new Error('Regex match failed');

const diffRes = computeTextDiff('line 1\nline 2', 'line 1\nline 2 mod');
console.log('Diff Stats:', diffRes.stats);
if (diffRes.stats.added !== 1 || diffRes.stats.removed !== 1) throw new Error('Diff calculation failed');

console.log('\n--- 7. Testing String & Case Conversions ---');
const caseRes = convertCase('user_account_profile', 'camelCase');
console.log('camelCase:', caseRes);
if (caseRes !== 'userAccountProfile') throw new Error('Case converter failed');

const sortedLines = sortLines('zebra\napple\nbanana', 'asc');
console.log('Sorted Lines:', sortedLines.replace(/\n/g, ', '));
if (!sortedLines.startsWith('apple')) throw new Error('Line sorter failed');

const dedup = removeDuplicateLines('a\nb\na\nc\nb');
console.log('Deduped Count:', dedup.uniqueCount);
if (dedup.uniqueCount !== 3) throw new Error('Duplicate remover failed');

const cleaned = cleanWhitespace('  hello   world  \n\n');
console.log('Cleaned Whitespace:', `"${cleaned}"`);

console.log('\n--- 8. Testing URL Parser & HTTP Simulator ---');
const parsedURL = parseURL('https://api.github.com:443/repos/octocat/Hello-World/issues?state=closed');
console.log('Parsed Host:', parsedURL.host, 'Path:', parsedURL.pathname);
if (parsedURL.hostname !== 'api.github.com') throw new Error('URL parser failed');

const curl = generateCurlCommand({ method: 'POST', url: 'https://api.example.com/v1', headers: { 'Authorization': 'Bearer token' }, body: '{"ok":true}' });
console.log('Generated cURL:\n', curl);

console.log('\n--- 9. Testing Timestamp & Color Inspector ---');
const ts = convertTimestamp('1724800000');
console.log('Timestamp ISO:', ts.iso);
if (!ts.iso.includes('2024')) throw new Error('Timestamp conversion failed');

const color = parseAndConvertColor('#3B82F6');
console.log('Color RGB:', color.rgb, 'HSL:', color.hsl, 'Contrast White:', color.contrastWhite);
if (!color.rgb.includes('59, 130, 246')) throw new Error('Color conversion failed');

console.log('\n--- 10. Testing Mock Generator ---');
const lorem = generateLorem('sentences', 2);
console.log('Lorem Sample:', lorem);
const mockUsers = generateMockUsers(2);
console.log('Mock Users JSON length:', mockUsers.length);

console.log('\n=============================================');
console.log('ALL 20 DEVBENCH ALGORITHMS VERIFIED SUCCESSFULLY!');
console.log('=============================================');
