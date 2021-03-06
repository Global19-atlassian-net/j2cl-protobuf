// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Test for equivalence.js.
 */
goog.module('proto.im.internal.EquivalenceTest');
goog.setTestOnly('proto.im.internal.EquivalenceTest');

const Equivalence = goog.require('proto.im.internal.Equivalence');
const testSuite = goog.require('goog.testing.testSuite');

class EquivalenceTest {
  testSame() {
    const array = [];
    assertTrue(Equivalence.equivalence(array, array));
    const object = {};
    assertFalse(Equivalence.equivalence(object, object));
    const aNumber = 3;
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aNumber)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aNumber))));
    const aBoolean = true;
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aBoolean)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aBoolean))));
    const aString = '';
    assertFalse(Equivalence.equivalence(
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aString)),
        /** @type {!Object<number, ?>} */ (/** @type {*} */ (aString))));
  }

  testSimpleField() {
    assertTrue(Equivalence.equivalence(['foo'], ['foo']));
    assertFalse(Equivalence.equivalence(['foo1'], ['foo2']));

    assertTrue(Equivalence.equivalence([1], [1]));
    assertFalse(Equivalence.equivalence([1], [2]));
  }

  testObjectField() {
    assertFalse(Equivalence.equivalence([{}, 'foo'], [{}, 'foo']));
    const sameObject = {};
    assertFalse(
        Equivalence.equivalence([sameObject, 'foo'], [sameObject, 'foo']));
  }

  testNestedMessage() {
    assertTrue(Equivalence.equivalence([['foo']], [['foo']]));
  }

  testFieldsInExtension() {
    assertTrue(
        Equivalence.equivalence(['foo', {10: 'bar'}], ['foo', {10: 'bar'}]));

    assertFalse(
        Equivalence.equivalence(['foo', {10: 'bar'}], ['foo', {10: 'baz'}]));
  }

  testFieldsInOneExtension() {
    assertTrue(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'bar'}]));

    assertFalse(
        Equivalence.equivalence(['foo', null, null, 'bar'], ['foo', {}]));
    assertFalse(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'baz'}]));

    assertTrue(Equivalence.equivalence(
        ['foo', {3: 'bar'}], ['foo', null, null, 'bar']));

    assertFalse(
        Equivalence.equivalence(['foo', {}], ['foo', null, null, 'bar']));
    assertFalse(Equivalence.equivalence(
        ['foo', {3: 'baz'}], ['foo', null, null, 'bar']));
  }

  testMoreFieldsPresentInExtension() {
    assertFalse(Equivalence.equivalence(
        ['foo', null, null, 'bar'], ['foo', {3: 'bar', 4: 'baz'}]));
  }

  testNull() {
    assertTrue(Equivalence.equivalence([null], []));
    assertTrue(Equivalence.equivalence(['foo', null, null], ['foo', null]));
  }
}

testSuite(new EquivalenceTest());
