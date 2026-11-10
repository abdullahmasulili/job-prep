import { bank, type Item, type RoleBank } from '../bank';
import type { Exercise, Tier } from '../types';

type Four = [string, string, string, string];
type Entry = [
  id: string,
  topic: string,
  prompt: string,
  options: Four,
  reasons: Four,
  code?: string,
];

function questions(entries: Entry[]) {
  return bank(
    entries.map(([id, topic, prompt, options, reasons, code], index): Item => {
      const answer = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 1, 0][index % 12];
      const rotate = (values: Four): Four =>
        [...values.slice(4 - answer), ...values.slice(0, 4 - answer)] as Four;
      return {
        id,
        topic,
        prompt,
        options: rotate(options),
        reasons: rotate(reasons),
        answer,
        ...(code ? { code } : {}),
      };
    }),
  );
}

const foundation: Entry[] = [
  [
    'fe-f-button',
    'Accessibility',
    'Clicking Preview unexpectedly submits this form. Which change preserves native keyboard activation and fixes the cause?',
    [
      'Declare Preview as type="button"',
      'Set form tabindex="0"',
      'Move the handler to pointerdown instead',
      'Add aria-pressed="false" to Preview',
    ],
    [
      'A button in a form defaults to submit; an explicit button type makes Preview an action.',
      'Focusability does not change the default button action.',
      'Earlier pointer handling does not change submit semantics and misses keyboard activation.',
      'Pressed state describes a toggle, not whether a button submits.',
    ],
    '<form><input name="title"><button onclick="preview()">Preview</button></form>',
  ],
  [
    'fe-f-box',
    'CSS and layout',
    'Assuming the default content-box sizing, what is the horizontal border-box width of this card?',
    [
      '244px including padding and borders',
      '200px with padding and borders inside the declared width',
      '240px including its padding',
      '204px including both borders',
    ],
    [
      'The content is 200px, padding adds 40px, and borders add 4px.',
      '200px is only the content width under content-box.',
      '240px omits the two 2px borders.',
      '204px accounts for borders but omits padding.',
    ],
    '.card { width: 200px; padding: 20px; border: 2px solid; }',
  ],
  [
    'fe-f-microtask',
    'JavaScript and browser',
    'What is the log order after this script runs in a browser?',
    ['A, C, B, D', 'A, B, C, D', 'A, C, D, B', 'A, D, B, C'],
    [
      'Synchronous logs finish before promise microtasks; the timer runs in a later task.',
      'The promise callback does not interrupt the synchronous script.',
      'The queued microtask runs before the next timer task.',
      'The timer callback cannot precede the remaining synchronous statements.',
    ],
    'console.log("A");\nPromise.resolve().then(() => console.log("B"));\nconsole.log("C");\nsetTimeout(() => console.log("D"), 0);',
  ],
  [
    'fe-f-fetch',
    'Async data',
    'The server returns HTTP 404 with a JSON body. Why does this code still call showProduct?',
    [
      'fetch fulfills even for HTTP error responses',
      'response.json changes status',
      'catch runs after showProduct has completed',
      'The response body bypasses promise handling',
    ],
    [
      'Check response.ok or status explicitly; HTTP failure statuses do not themselves reject fetch.',
      'Parsing JSON does not convert an HTTP status into a successful status.',
      'catch handles rejection; it is not a mandatory final step.',
      'Body parsing is asynchronous and still follows promise handling.',
    ],
    'fetch("/product/12")\n  .then(r => r.json())\n  .then(showProduct)\n  .catch(showError);',
  ],
  [
    'fe-f-xss',
    'Security',
    'A profile name is plain text from another user. Which assignment displays it without interpreting markup?',
    [
      'heading.textContent = name',
      'heading.innerHTML = name',
      'heading.outerHTML = name.trim()',
      'heading.insertAdjacentHTML("beforeend", name)',
    ],
    [
      'textContent creates text rather than parsing user-controlled HTML.',
      'innerHTML parses markup and can introduce injection.',
      'Trimming removes whitespace, not dangerous markup; outerHTML parses it.',
      'insertAdjacentHTML is an HTML parser and is unsuitable for untrusted plain text.',
    ],
    'const name = profile.displayName;\nconst heading = document.querySelector("h1");',
  ],
  [
    'fe-f-mutation',
    'JavaScript and browser',
    'Which value is printed, and why?',
    [
      '2, because both variables reference one object',
      '1, because const freezes the assigned object',
      'undefined, because the field was not copied',
      'An error, because alias cannot be reassigned',
    ],
    [
      'Assignment copies the object reference, so mutation through either variable is visible.',
      'const prevents rebinding; it does not freeze object properties.',
      'alias refers to the object that already contains count.',
      'The code changes a property, not the const binding.',
    ],
    'const original = { count: 1 };\nconst alias = original;\nalias.count = 2;\nconsole.log(original.count);',
  ],
  [
    'fe-f-label',
    'Accessibility',
    'A shipping form has visible text beside an input, but clicking the text does not focus it and its accessible name is missing. What connects them?',
    [
      'A label whose for matches the input id',
      'A name matching the neighboring text',
      'A title copied from the visible placeholder',
      'A section with an aria-live attribute',
    ],
    [
      'An associated label supplies the name and expected click-to-focus behavior.',
      'name controls form serialization and does not associate neighboring text.',
      'A title is not the intended persistent label association and does not give the text click behavior.',
      'A live region announces changes; it does not label a field.',
    ],
  ],
  [
    'fe-f-image',
    'Performance',
    'A news image pushes the headline down when it finishes loading. Which intervention targets the layout shift?',
    [
      'Reserve space with a matching image aspect ratio',
      'Compress the image bytes',
      'Preconnect to the image host during startup',
      'Move image decoding onto an idle callback',
    ],
    [
      'Reserved geometry prevents later image dimensions from moving existing content.',
      'Compression can speed loading but does not reserve layout space.',
      'Connection setup affects timing, not missing geometry.',
      'Scheduling decode differently does not allocate the image box in advance.',
    ],
  ],
  [
    'fe-f-test',
    'Testing',
    'A login form regression drops the email after a failed request. Which test directly protects the user’s work?',
    [
      'Reject a submit, then assert the email remains',
      'Assert the submit handler calls the API mock',
      'Snapshot the form before any input is entered',
      'Check the input value before pressing Submit',
    ],
    [
      'This exercises the failed transition and checks the exact preservation contract.',
      'Calling the API says nothing about the value after failure.',
      'An initial snapshot cannot expose a post-failure state bug.',
      'A pre-submit assertion misses destructive updates during failure handling.',
    ],
  ],
  [
    'fe-f-nullish',
    'JavaScript and browser',
    'A settings panel should preserve an explicit volume of zero. Which expression defaults only null or undefined?',
    ['settings.volume ?? 50', 'settings.volume || 50', '50', 'Number(settings.volume) || 50'],
    [
      'Nullish coalescing preserves zero and substitutes for null or undefined.',
      'Logical OR treats zero as falsy and substitutes 50.',
      'A fixed value ignores an explicitly configured volume, including zero.',
      'Converting to Number still leaves zero falsy for the following OR.',
    ],
    'const settings = { volume: 0 };',
  ],
  [
    'fe-f-cascade',
    'CSS and layout',
    'Both declarations are normal author rules outside layers. What color does the element use?',
    [
      'Blue, because the ID selector is more specific',
      'Red, because the class rule occurs later',
      'Blue, because the first matching rule is kept',
      'Red, because classes override element IDs',
    ],
    [
      'An ID selector has greater specificity than a class selector.',
      'Source order breaks ties; it does not override greater specificity here.',
      'The outcome is blue, but the first match is not the cascade rule.',
      'Class specificity is lower than ID specificity.',
    ],
    '#notice { color: blue; }\n.notice { color: red; }\n/* <p id="notice" class="notice">Update</p> */',
  ],
  [
    'fe-f-navigation',
    'Accessibility',
    'A card title opens a real detail URL. Which implementation supports copy-link, keyboard access, and opening another tab?',
    [
      'An anchor with the detail URL in href',
      'A scripted navigation button',
      'A focusable span with an Enter handler',
      'A div with role="link" and click navigation',
    ],
    [
      'A native anchor exposes the URL and browser link interactions.',
      'A button can navigate, but does not provide native link context-menu behavior.',
      'A key handler does not supply the full link interaction contract.',
      'An ARIA role does not implement link URL behavior or browser context menus.',
    ],
  ],
];

const practice: Entry[] = [
  [
    'fe-p-race',
    'Async data',
    'Typing cat then dog starts two requests. Dog resolves first; cat resolves last. Which update condition preserves the current query?',
    [
      'Commit only the current request ID',
      'Commit whichever response has more rows',
      'Commit after a fixed 300ms response delay',
      'Use arrival order',
    ],
    [
      'Request identity connects a response to the query that still owns the view.',
      'Result size does not establish whether a response belongs to the active query.',
      'A delay cannot guarantee request completion order.',
      'Arrival order is the source of the stale-result bug.',
    ],
    'async function search(q) {\n  const rows = await fetchRows(q);\n  render(rows);\n}',
  ],
  [
    'fe-p-flex',
    'CSS and layout',
    'The title flex item refuses to shrink around an unbroken token. It should truncate while the action remains visible. Which change removes its explicit content-based minimum?',
    [
      'Set min-width: 0 on .title',
      'Grow .action',
      'Set justify-content: space-between',
      'Set width: 100% on the whole row',
    ],
    [
      'Removing the item’s explicit content minimum permits shrinking; the existing ellipsis can then apply.',
      'Growing the action increases pressure without removing the title’s minimum.',
      'Alignment distributes free space but does not change intrinsic minimum sizing.',
      'The row already has a constrained width; its child is the source of overflow.',
    ],
    '.row { display: flex; width: 240px; }\n.title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: min-content; }\n.action { flex: none; }',
  ],
  [
    'fe-p-counter',
    'JavaScript and browser',
    'A counter using this handler increments by two on the second visit. Which lifecycle repair matches the evidence?',
    [
      'Remove the same handler on teardown',
      'Reset count whenever the button is clicked',
      'Debounce increments across both visits',
      'Replace click with a pointerup listener',
    ],
    [
      'Repeated mounting adds handlers; removing the registered function balances setup.',
      'Resetting state masks the symptom and destroys the increment contract.',
      'Debouncing changes intended behavior while retaining leaked listeners.',
      'Changing event type still leaks registrations across visits.',
    ],
    'function mount(button) {\n  const increment = () => count++;\n  button.addEventListener("click", increment);\n  return () => {};\n}',
  ],
  [
    'fe-p-number',
    'JavaScript and browser',
    'A quantity input returns "3". What targeted correction makes the total 4 without string concatenation?',
    [
      'Convert the value before adding one',
      'Convert the resulting string to a number',
      'Replace the input change event with blur',
      'Set the input name to a numeric identifier',
    ],
    [
      'Number(input.value) + 1 performs numeric addition after validating expected input.',
      'Number("31") yields 31, so converting after concatenation is too late.',
      'Changing timing does not change the string value type.',
      'The name identifies the form field; it does not convert its value.',
    ],
    'const total = input.value + 1;',
  ],
  [
    'fe-p-focus',
    'Accessibility',
    'Closing a confirmation dialog removes the focused button. What should the close path usually do when the opener still exists?',
    [
      'Restore focus to the opening control',
      'Focus the first heading',
      'Leave focus on the removed button object',
      'Announce the close through a polite region',
    ],
    [
      'Returning to the opener preserves the interaction context and keyboard position.',
      'A page heading is an unrelated destination when the opener is still available.',
      'A detached node cannot retain usable document focus.',
      'An announcement does not restore a keyboard interaction location.',
    ],
  ],
  [
    'fe-p-grid',
    'CSS and layout',
    'A two-column grid must keep equal tracks inside a fixed container despite a long code token. Which track rule permits both tracks to shrink below their content minimum?',
    [
      'repeat(2, minmax(0, 1fr))',
      'repeat(2, minmax(auto, 1fr))',
      'repeat(2, max-content)',
      'repeat(2, minmax(min-content, 1fr))',
    ],
    [
      'A zero minimum avoids the automatic content-based floor; the code itself can use local scrolling.',
      'An auto minimum can preserve the content floor causing overflow.',
      'max-content sizes to unwrapped content rather than available space.',
      'A min-content floor still honors the long token’s minimum width.',
    ],
    '.results { display: grid; width: 400px; grid-template-columns: 1fr 1fr; }',
  ],
  [
    'fe-p-url',
    'Async data',
    'A filter value contains "design & research". Which construction preserves it as one query parameter?',
    [
      'Use URLSearchParams to encode the value',
      'Concatenate the raw value after ?team=',
      'Replace spaces with plus and keep ampersands',
      'Apply encodeURI to the completed query URL',
    ],
    [
      'URLSearchParams escapes parameter data, including ampersands that otherwise delimit parameters.',
      'The ampersand would be parsed as a parameter separator.',
      'Space replacement leaves the ampersand ambiguous.',
      'encodeURI preserves query syntax characters and is not parameter-value encoding.',
    ],
    'const team = "design & research";',
  ],
  [
    'fe-p-save',
    'Async data',
    'A retry button can be pressed while its save request is pending. Which UI state transition most directly prevents accidental overlapping submits?',
    [
      'Enter pending synchronously before awaiting',
      'Clear the draft when the request starts',
      'Set pending after the response is parsed',
      'Hide the status after a short timeout',
    ],
    [
      'Set a synchronous guard and expose disabled/pending feedback before another activation can enter.',
      'Clearing user data does not prevent a second request and harms recovery.',
      'Waiting until completion leaves the overlap window open.',
      'A feedback timeout is unrelated to request ownership.',
    ],
    'async function save() {\n  await persist(draft);\n  pending = true;\n}',
  ],
  [
    'fe-p-keyboard-test',
    'Testing',
    'A custom disclosure works with a mouse but fails from the keyboard. Which regression test best establishes the missing behavior?',
    [
      'Focus its control, activate, assert expansion',
      'Dispatch click directly to the hidden panel',
      'Assert the expand function appears in coverage',
      'Compare the panel screenshot after page load',
    ],
    [
      'Keyboard interaction and the expanded state check the user-facing contract.',
      'Clicking the panel bypasses the actual control and keyboard path.',
      'Coverage says a function ran, not that keyboard users can reach it.',
      'An initial screenshot cannot demonstrate interactive keyboard support.',
    ],
  ],
  [
    'fe-p-paint',
    'Performance',
    'The status text changes in the DOM, but the spinner does not paint until expensive work completes. What explains this?',
    [
      'The synchronous loop blocks rendering',
      'The DOM write is deferred until the loop ends',
      'Promise jobs run the loop on another thread',
      'The status update waits for another DOM mutation',
    ],
    [
      'A long main-thread task delays rendering opportunities; split or offload the work.',
      'The assignment updates the DOM synchronously; the delayed step is rendering it.',
      'This is a synchronous loop, and promise jobs would still execute on the main thread.',
      'Repeating the assignment adds no rendering opportunity.',
    ],
    'status.textContent = "Working";\nfor (let i = 0; i < 1e9; i++) compute(i);',
  ],
  [
    'fe-p-secret',
    'Security',
    'A deployed browser bundle contains a privileged API key read from a build variable. What is the appropriate repair?',
    [
      'Revoke it and move privileged calls server-side',
      'Rename the variable and rebuild the bundle',
      'Encode the key before embedding the same value',
      'Load the key from a separate public JSON file',
    ],
    [
      'Browser-delivered secrets are exposed; revoke the key and keep its replacement behind authorization.',
      'Renaming does not prevent users inspecting delivered code.',
      'Client-side encoding is reversible and still delivers the credential.',
      'A public file changes location rather than confidentiality.',
    ],
  ],
  [
    'fe-p-error',
    'Accessibility',
    'A payment field error appears below the input. Users need its text when focusing that field. Which association is appropriate?',
    [
      'Reference its id with aria-describedby',
      'Set the error element’s name to the field id',
      'Put aria-label on the error paragraph',
      'Give the field a new positive tabindex',
    ],
    [
      'aria-describedby connects supplementary error text; invalid state can also be exposed with aria-invalid.',
      'A name attribute on a paragraph does not describe the input.',
      'Labeling the paragraph does not associate it with the input.',
      'Tab ordering does not convey an error description and may disrupt navigation.',
    ],
  ],
];

const juniorFundamentals: Entry[] = [
  [
    'fe-jf-map',
    'JavaScript and browser',
    'Why is labels an array of undefined values rather than names?',
    [
      'The callback block needs a return',
      'map changes the original users array',
      'The name field must be converted to a string',
      'An array callback cannot read object fields',
    ],
    [
      'A block-bodied arrow needs an explicit return to provide each mapped value.',
      'map creates another array and is not an in-place transformation.',
      'Reading a string property is valid without conversion.',
      'Callbacks can access object properties normally.',
    ],
    'const labels = users.map(user => { user.name; });',
  ],
  [
    'fe-jf-alt',
    'Accessibility',
    'A decorative flourish appears beside a heading that already contains all the information. What alternative text is appropriate?',
    [
      'An empty alt attribute',
      'The same text as the heading',
      'A detailed description of every curve',
      'The image asset’s descriptive filename',
    ],
    [
      'Empty alt marks a decorative image so assistive technology can skip redundant content.',
      'Repeating the heading introduces redundant reading.',
      'Decorative detail adds noise rather than information needed for the task.',
      'A filename is generally not meaningful alternative content.',
    ],
  ],
  [
    'fe-jf-submit',
    'Accessibility',
    'A form only handles clicks on its save button. Pressing Enter in a field does not reach custom validation consistently. Where should the behavior be owned?',
    [
      'The form submit handler',
      'The input keydown handler for every key',
      'The document click handler for all buttons',
      'The button focus handler before submission',
    ],
    [
      'Form submission is the shared semantic entry point for supported submission methods.',
      'Per-key handlers duplicate native behavior and can interfere with text entry.',
      'Global click handling still misses non-click submission paths.',
      'Focus is not an intention to submit and can occur during exploration.',
    ],
  ],
  [
    'fe-jf-wrap',
    'CSS and layout',
    'A row of filter chips fits English but overflows after translation. Which layout behavior accommodates variable labels?',
    [
      'Enable flex wrapping with a gap',
      'Increase the row’s fixed pixel width',
      'Keep one line and reduce every label font',
      'Give each chip the original English width',
    ],
    [
      'Wrapping responds to available width and allows translated content to retain readable sizing.',
      'A larger fixed width transfers overflow to narrower viewports.',
      'Shrinking text sacrifices readability and does not establish a robust constraint.',
      'Fixed English widths do not account for translated content.',
    ],
  ],
  [
    'fe-jf-find',
    'JavaScript and browser',
    'No product has id 9. What must this rendering path handle?',
    [
      'find returns undefined',
      'find returns an empty array',
      'find returns the final product inspected',
      'find rejects with a missing-item error',
    ],
    [
      'find returns undefined when nothing matches, so accessing title requires a missing-item path.',
      'filter returns an array; find returns one element or undefined.',
      'A failed search does not use the last element as fallback.',
      'find is synchronous and does not reject a promise.',
    ],
    'const product = products.find(p => p.id === 9);\nheading.textContent = product.title;',
  ],
  [
    'fe-jf-array',
    'JavaScript and browser',
    'What does the final log print?',
    ['3', '2', '4 after both arrays grow', 'undefined because push returns nothing'],
    [
      'The spread creates a new outer array; pushing to b leaves a at length two while b reaches three.',
      'b receives an additional element after copying a.',
      'Only b is pushed; a is not extended.',
      'The expression logs b.length, not the return value of push.',
    ],
    'const a = [1, 2];\nconst b = [...a];\nb.push(3);\nconsole.log(b.length);',
  ],
  [
    'fe-jf-progress',
    'Accessibility',
    'A completed upload is shown by changing a dot from gray to green. Which improvement communicates the result independently of color?',
    [
      'Add visible “Upload complete” text',
      'Choose a brighter shade of green',
      'Increase the colored dot’s diameter',
      'Animate the dot when its color changes',
    ],
    [
      'Text names the state without requiring color discrimination.',
      'Brightness may improve visibility but still relies on interpreting color.',
      'Size alone does not explain whether upload succeeded.',
      'Motion attracts attention without naming the outcome.',
    ],
  ],
  [
    'fe-jf-storage',
    'Security',
    'A teammate proposes storing a user’s password in localStorage to prefill login next time. What is the strongest objection?',
    [
      'Page scripts can read the stored password',
      'The storage API requires a numeric key',
      'The password will expire at the next render',
      'localStorage automatically sends it with requests',
    ],
    [
      'Any script executing in that origin can read localStorage, making password persistence especially hazardous.',
      'localStorage keys are strings, but that is not the security concern.',
      'Storage persists independently of UI rendering.',
      'Unlike cookies, localStorage values are not automatically attached to requests.',
    ],
  ],
  [
    'fe-jf-test-empty',
    'Testing',
    'A list has separate loading, empty, and populated states. Which fixture is needed to verify empty is distinct from loading?',
    [
      'A resolved request with zero records',
      'A promise that remains pending indefinitely',
      'A response containing one unnamed record',
      'A request rejected before it reaches the server',
    ],
    [
      'A successful zero-record response is the empty-state condition.',
      'A pending promise should produce loading, not empty.',
      'One record still represents populated data even if malformed.',
      'A rejection exercises an error condition.',
    ],
  ],
  [
    'fe-jf-img-fluid',
    'CSS and layout',
    'A 1200px image overflows a 320px article. Which CSS keeps it proportional while allowing it to shrink?',
    [
      'max-width: 100%; height: auto',
      'width: 1200px; height: 320px',
      'min-width: 100%; height: 100%',
      'width: auto; min-height: 1200px',
    ],
    [
      'The maximum limits width to the container and automatic height preserves proportion.',
      'A fixed large width still overflows and the height can distort the image.',
      'A minimum does not cap width and percentage height may distort or lack a basis.',
      'A large minimum height can enlarge the image rather than contain it.',
    ],
  ],
  [
    'fe-jf-defer',
    'Performance',
    'Several classic scripts need the parsed DOM and must execute in document order. Which loading mode fits?',
    [
      'Use defer on each external script',
      'Use async on each external script',
      'Place blocking scripts before the page title',
      'Fetch the scripts as image preload resources',
    ],
    [
      'Deferred classic external scripts run after parsing and retain document order.',
      'Async scripts execute when ready and do not preserve document order.',
      'Parser-blocking scripts delay parsing and may run before needed DOM exists.',
      'An image preload is the wrong destination and does not execute scripts.',
    ],
  ],
  [
    'fe-jf-validation',
    'Security',
    'An email field uses type="email" and required. Which boundary still needs validation?',
    [
      'The server receiving the submitted value',
      'Only the click handler of the submit button',
      'Only the browser’s saved autocomplete entries',
      'The stylesheet that draws the error message',
    ],
    [
      'Requests can bypass the browser form, so the server must validate accepted data.',
      'A button handler is another bypassable client path.',
      'Stored suggestions are not the sole source of submitted data.',
      'Presentation does not enforce input validity at the trust boundary.',
    ],
  ],
];

const juniorPractical: Entry[] = [
  [
    'fe-jp-check',
    'Forms',
    'An unchecked newsletter box still appears enabled in saved data. Which property should this handler read?',
    [
      'checkbox.checked',
      'checkbox.value.trim()',
      'checkbox.getAttribute("checked")',
      'checkbox.defaultChecked',
    ],
    [
      'checked reflects the current boolean state controlled by the user.',
      'value is the submitted value when checked, often "on", not the current boolean state.',
      'The attribute describes the markup default rather than current interaction state.',
      'defaultChecked represents the initial default and may differ from the live state.',
    ],
    'const enabled = Boolean(checkbox.value);',
  ],
  [
    'fe-jp-sort',
    'JavaScript and browser',
    'Why does the displayed numeric order become 1, 10, 2?',
    [
      'Default sort compares string representations',
      'sort visits the input in insertion order',
      'The browser rounds two-digit numbers first',
      'The copied array loses its numeric value types',
    ],
    [
      'Supply (a, b) => a - b for ascending numeric order.',
      'sort reorders by its comparison behavior rather than preserving insertion order.',
      'There is no rounding step in this operation.',
      'Spreading numbers into a new array preserves their types.',
    ],
    'const numbers = [2, 10, 1];\nrender([...numbers].sort());',
  ],
  [
    'fe-jp-filter',
    'JavaScript and browser',
    'A list should retain active users, but this callback produces an empty list. Which correction expresses the predicate?',
    [
      'Return user.active from the callback',
      'Return users from the callback instead',
      'Replace filter with forEach using the same body',
      'Set user.active to true inside the callback',
    ],
    [
      'filter retains an item when its callback returns a truthy predicate value.',
      'Returning an array is truthy for every item and ignores active status.',
      'forEach does not create a filtered output array.',
      'Mutating status changes data rather than selecting existing active users.',
    ],
    'const active = users.filter(user => { user.active; });',
  ],
  [
    'fe-jp-font',
    'CSS and layout',
    'At 200% zoom a fixed-height notification clips its second line. What is the most direct content-safe adjustment?',
    [
      'Use min-height and allow content to grow',
      'Double the fixed width of the notification',
      'Use overflow: hidden on the containing page',
      'Apply a transform that scales the text down',
    ],
    [
      'A minimum keeps the intended baseline while allowing additional text height.',
      'Extra fixed width can cause horizontal overflow and does not reliably accommodate zoom.',
      'Clipping on an ancestor further hides content.',
      'Scaling text down undermines the user’s zoom preference.',
    ],
  ],
  [
    'fe-jp-anchor',
    'Accessibility',
    'An in-page link scrolls a heading beneath a sticky header. Which CSS can preserve the heading’s visible destination?',
    [
      'Set scroll-margin-top on the heading',
      'Set a negative line-height on the heading',
      'Raise the heading’s z-index above the page',
      'Give the link a larger horizontal padding',
    ],
    [
      'Scroll margin offsets the target position without changing its document layout.',
      'A negative line-height is not an appropriate scroll offset.',
      'Stacking changes do not adjust the anchor scroll destination.',
      'Link padding does not change where its target is scrolled.',
    ],
  ],
  [
    'fe-jp-event',
    'JavaScript and browser',
    'Clicking a nested SVG makes this handler read a missing dataset.id. Which event property identifies the element where the handler was registered?',
    ['event.currentTarget', 'event.target', 'event.relatedTarget', 'event.defaultPrevented'],
    [
      'currentTarget is the element whose listener is currently executing.',
      'target is the originating nested element, which causes this bug.',
      'relatedTarget identifies a secondary element for some events, not the registered button.',
      'defaultPrevented is a boolean about cancellation, not an element.',
    ],
    'button.addEventListener("click", event => {\n  openItem(event.target.dataset.id);\n});',
  ],
  [
    'fe-jp-password',
    'Forms',
    'A show-password control is a toggle. Which state should change along with the input type so assistive technology can determine whether it is active?',
    [
      'aria-pressed on the toggle button',
      'aria-required on the password field',
      'aria-current on the containing form',
      'aria-disabled on the password label',
    ],
    [
      'Pressed state exposes whether a stable-label toggle such as “Show password” is active.',
      'Required describes whether input is mandatory, not visibility.',
      'Current identifies an active item in a set and is not toggle state.',
      'Disabling a label does not communicate password visibility.',
    ],
  ],
  [
    'fe-jp-offline',
    'Async data',
    'A profile edit fails while the device is offline. Which recovery behavior avoids unnecessary re-entry?',
    [
      'Retain the draft and offer a retry',
      'Reload the profile before showing feedback',
      'Restore server values as soon as fetch rejects',
      'Treat the local draft as remotely saved',
    ],
    [
      'Keeping the draft preserves work while clearly separating unsaved and saved state.',
      'A reload can discard edits and may also fail offline.',
      'Restoring older values destroys the user’s unsaved changes.',
      'Local state does not prove persistence at the server.',
    ],
  ],
  [
    'fe-jp-required',
    'Testing',
    'A required field test clicks Submit and immediately expects the network mock to run. What should the empty-input test assert instead?',
    [
      'Validation feedback and no submitted request',
      'The request body includes an empty field',
      'The form resets to its original placeholder',
      'The button receives a second click event',
    ],
    [
      'The invalid-input contract is to prevent submission and communicate the missing value.',
      'Sending invalid data defeats the client validation behavior being tested.',
      'A reset does not demonstrate validation and may erase other fields.',
      'Click count is unrelated to whether invalid data is blocked.',
    ],
  ],
  [
    'fe-jp-abort',
    'Async data',
    'A request is intentionally canceled when leaving a screen. Which error policy avoids a misleading failure toast?',
    [
      'Distinguish cancellation from request failure',
      'Convert every rejected promise into success',
      'Retry the canceled request before navigating',
      'Display the server error message for any rejection',
    ],
    [
      'Expected cancellation is a lifecycle outcome rather than a user-visible service fault.',
      'Other rejections still need an honest failure state.',
      'Retrying defeats cancellation and can update a departed screen.',
      'A canceled operation may have no server error and should not be mislabeled.',
    ],
  ],
  [
    'fe-jp-touch',
    'Accessibility',
    'Tiny adjacent icon buttons are frequently mis-tapped. Which change helps without changing their meaning?',
    [
      'Increase interactive areas and spacing',
      'Increase icon contrast without resizing targets',
      'Require a double tap for every operation',
      'Place both icons inside one shared button',
    ],
    [
      'Larger separated targets reduce accidental activation of neighboring actions.',
      'Contrast helps visibility but does not solve target precision.',
      'Double taps introduce another interaction barrier and unexpected behavior.',
      'Combining different actions into one button makes intent ambiguous.',
    ],
  ],
  [
    'fe-jp-code-scroll',
    'CSS and layout',
    'A long example should remain readable without making the whole page scroll sideways. Where should horizontal scrolling be contained?',
    [
      'On the constrained code block',
      'On every ancestor up to the document',
      'On a fixed-width wrapper wider than the screen',
      'On the heading preceding the example',
    ],
    [
      'Local overflow keeps the exceptional wide content usable while the page remains responsive.',
      'Multiple nested scroll containers create competing navigation and may keep page overflow.',
      'An oversized wrapper causes the page overflow the requirement rejects.',
      'The heading does not contain the overflowing code content.',
    ],
  ],
  [
    'fe-jp-image-test',
    'Testing',
    'A banner’s text disappears against its background in high-contrast mode. Which check is most likely to reveal the problem before release?',
    [
      'Render the banner in forced-colors mode',
      'Assert the CSS file was requested once',
      'Snapshot the JavaScript props of the banner',
      'Check the banner at the default color theme',
    ],
    [
      'A forced-colors rendering check exercises the affected presentation environment.',
      'Loading styles does not show whether overridden colors preserve legibility.',
      'Props do not capture platform color substitution.',
      'The default theme omits the condition where the bug occurs.',
    ],
  ],
  [
    'fe-jp-json',
    'Async data',
    'The response is 200, but its body is malformed JSON. Which operation can still reject?',
    [
      'await response.json()',
      'response.ok',
      'response.status === 200',
      'response.headers.has("content-type")',
    ],
    [
      'JSON parsing is asynchronous and rejects on invalid JSON even after a successful HTTP response.',
      'ok is a synchronous boolean derived from the HTTP status.',
      'Comparing the numeric status does not parse the body.',
      'Checking a header does not parse or validate the payload.',
    ],
    'const response = await fetch("/settings");\nif (response.ok) { /* read body */ }',
  ],
  [
    'fe-jp-default',
    'JavaScript and browser',
    'A user enters zero minutes, but the preview shows 15. Which change retains zero as a deliberate input?',
    [
      'Use minutes ?? 15',
      'Use minutes && 15',
      'Use Boolean(minutes) || 15',
      'Use parseInt(minutes, 10) || 15',
    ],
    [
      'Nullish fallback distinguishes absence from a valid numeric zero.',
      'AND replaces nonzero values with 15 and leaves zero unchanged for the wrong rule.',
      'Boolean conversion still treats zero as false and triggers the fallback.',
      'Parsing zero still yields a falsy zero before OR.',
    ],
    'const preview = minutes || 15;',
  ],
  [
    'fe-jp-hidden',
    'Accessibility',
    'A visually hidden mobile menu remains in the Tab sequence when closed. Which simple hiding strategy removes its subtree from keyboard navigation and rendering?',
    [
      'Apply the hidden attribute while closed',
      'Set opacity to zero on the menu',
      'Move the menu left by its own width',
      'Give the container tabindex="-1"',
    ],
    [
      'The hidden state normally removes the subtree from layout and interaction; avoid CSS that overrides it.',
      'Transparent elements can remain focusable.',
      'Offscreen positioning can leave interactive descendants in the Tab sequence.',
      'Changing the container tab index does not remove focusable descendants.',
    ],
  ],
  [
    'fe-jp-id',
    'Accessibility',
    'Two address fields reuse id="city", so both labels focus the first field. What should change?',
    [
      'Assign unique IDs and matching label targets',
      'Give both labels the same extra class name',
      'Add a shared name attribute to both inputs',
      'Move the second label below its input',
    ],
    [
      'Unique IDs make each label association unambiguous.',
      'Classes are styling hooks, not label targets.',
      'name affects submitted keys and does not repair duplicate IDs.',
      'Visual placement does not repair the broken association.',
    ],
  ],
  [
    'fe-jp-delegation',
    'JavaScript and browser',
    'New rows added after initialization have no working Delete handler. Which approach handles future row buttons without rebinding each one?',
    [
      'Delegate clicks from the persistent list',
      'Clone an old row after removing its contents',
      'Wait for DOMContentLoaded before every delete',
      'Attach a handler only to the newest row',
    ],
    [
      'Bubbling lets a stable ancestor inspect matching delete buttons added later.',
      'Cloning nodes does not copy listeners registered with addEventListener.',
      'DOMContentLoaded runs for document initialization, not each later interaction.',
      'Handling only the newest row leaves other newly inserted rows inconsistent.',
    ],
  ],
  [
    'fe-jp-css-order',
    'CSS and layout',
    'CSS order places the purchase button first visually, while Tab still reaches it last. What best aligns reading and interaction order?',
    [
      'Use a meaningful matching DOM order',
      'Assign increasing positive tabindex values',
      'Move keyboard focus during every Tab press',
      'Set aria-live on the reordered container',
    ],
    [
      'A logical source order naturally aligns keyboard and reading sequence.',
      'Positive tabindex creates a separate brittle ordering system across the page.',
      'Intercepting Tab can trap or confuse keyboard navigation.',
      'Live announcements do not change focus order.',
    ],
  ],
  [
    'fe-jp-injection',
    'Security',
    'A search page echoes a URL query into innerHTML. Which smallest safe change fits the requirement to show the query as plain text?',
    [
      'Assign the decoded query with textContent',
      'Strip only the literal string "script"',
      'Encode the entire URL before reading its query',
      'Permit markup only when the query is short',
    ],
    [
      'A text sink does not interpret untrusted query data as markup.',
      'Injection has many forms and bypasses keyword removal.',
      'URL encoding is a transport encoding, not a safe HTML rendering policy.',
      'Short markup can still be dangerous; length is not a trust boundary.',
    ],
  ],
  [
    'fe-jp-lazy',
    'Performance',
    'A gallery has dozens of images below the initial viewport. Which loading choice saves initial work while preserving the prominent first image?',
    [
      'Lazy-load offscreen images',
      'Lazy-load the visible hero before other images',
      'Give every image the highest fetch priority',
      'Embed every photo directly in the HTML',
    ],
    [
      'Deferring noncritical offscreen images reduces initial network demand.',
      'Delaying the prominent first image can hurt the main visible content.',
      'Marking everything high priority removes useful prioritization.',
      'Embedding all photos increases the initial document payload.',
    ],
  ],
  [
    'fe-jp-list-test',
    'Testing',
    'Deleting row B mistakenly removes row C after sorting. Which test targets the identity bug?',
    [
      'Sort, delete B, assert B absent and C present',
      'Assert the array length decreases by one',
      'Delete the first row before applying sorting',
      'Assert the delete icon has the expected class',
    ],
    [
      'This distinguishes stable identity from a stale position after reordering.',
      'A length check passes even when the wrong item is deleted.',
      'The problematic order change is absent from that test.',
      'A visual class cannot establish which record is removed.',
    ],
  ],
  [
    'fe-jp-loading',
    'Forms',
    'A spinner replaces the entire submit button while saving, causing layout movement and losing the focused control. What is a better pending presentation?',
    [
      'Keep the button and update its busy feedback',
      'Move the spinner to the document title only',
      'Replace the form with an empty loading section',
      'Return focus to the first input on every save',
    ],
    [
      'Preserving the control and stable geometry avoids unnecessary focus and layout disruption.',
      'Title-only feedback is easy to miss and does not preserve button context.',
      'Removing the form disrupts context and can discard editable state.',
      'Moving focus unnecessarily interrupts the user’s current action.',
    ],
  ],
  [
    'fe-jp-cleanup',
    'Performance',
    'Navigating between pages leaves this repeating timer active. What resource must teardown release?',
    [
      'The interval identified by timer',
      'The Date object created by each tick',
      'The string assigned to the clock element',
      'The document’s global click event queue',
    ],
    [
      'clearInterval(timer) balances the repeating work established during setup.',
      'Temporary Date objects are garbage collected when unreachable.',
      'Replacing text does not create a repeating scheduling resource.',
      'There is no global click queue resource associated with this timer.',
    ],
    'const timer = setInterval(() => updateClock(), 1000);',
  ],
];

const midFundamentals: Entry[] = [
  [
    'fe-mf-closure',
    'JavaScript and browser',
    'Which values do the timer callbacks log after this loop finishes?',
    ['3, 3, 3', '0, 1, 2', '1, 2, 3', 'An exception followed by two zeros'],
    [
      'var creates one shared binding whose final value is three when the callbacks execute.',
      'That would fit separate per-iteration let bindings, not this shared var.',
      'Callbacks run after the loop, not after each increment.',
      'Reading the initialized var binding is legal and does not throw.',
    ],
    'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}',
  ],
  [
    'fe-mf-shallow',
    'JavaScript and browser',
    'A draft edit changes the original profile despite object spread. Which boundary remains shared?',
    [
      'The nested address reference',
      'The profile binding',
      'The string literal "New city"',
      'Every object allocated after the spread',
    ],
    [
      'Spread copies own properties shallowly, retaining the nested object reference.',
      'The two top-level objects differ; the nested reference is the problem.',
      'Strings are immutable primitive values and are not the alias here.',
      'Object allocation after the copy is unrelated to shared existing references.',
    ],
    'const draft = { ...profile };\ndraft.address.city = "New city";',
  ],
  [
    'fe-mf-promise',
    'Async data',
    'The optional reviews endpoint rejects while product details succeed. What does Promise.all do for this combined result?',
    [
      'Rejects the combined promise',
      'Resolves with the successful product only',
      'Cancels both underlying fetch requests',
      'Waits for another reviews attempt automatically',
    ],
    [
      'Promise.all rejects when an input rejects; partial display needs separate handling or allSettled.',
      'It does not return a partial fulfillment array after a rejection.',
      'Rejection does not automatically cancel ongoing operations.',
      'Retries require an explicit policy.',
    ],
    'const [product, reviews] = await Promise.all([loadProduct(), loadReviews()]);',
  ],
  [
    'fe-mf-origin',
    'Security',
    'An authenticated browser request is blocked by CORS. What does switching fetch to no-cors usually produce for application code?',
    [
      'An opaque response with unreadable body',
      'A readable response without credentials',
      'A response exempt from the server’s policy',
      'A JSON object with restricted headers removed',
    ],
    [
      'no-cors does not grant read access; the opaque response cannot supply the desired JSON.',
      'The mode does not provide a readable response as a workaround.',
      'Client code cannot bypass cross-origin access policy by choosing this mode.',
      'Opaque responses hide the body, not merely selected headers.',
    ],
  ],
  [
    'fe-mf-stack',
    'CSS and layout',
    'A tooltip with z-index: 9999 is still beneath a sibling panel. Its ancestor forms a lower stacking context. What is the relevant constraint?',
    [
      'Its z-index is local to that context',
      'The browser caps z-index at 1000',
      'Positioned descendants ignore all z-index values',
      'A smaller z-index would bring it forward',
    ],
    [
      'A child cannot escape its ancestor’s stacking context simply by increasing its local z-index.',
      'There is no general browser cap of 1000 explaining this behavior.',
      'Positioning and stacking contexts determine how z-index participates; it is not universally ignored.',
      'Reducing a local stacking level does not lift the ancestor above its sibling.',
    ],
  ],
  [
    'fe-mf-roving',
    'Accessibility',
    'A composite tab list uses roving tabindex. Which allocation keeps a single entry point while allowing arrow-key navigation?',
    [
      'Active tab 0; other tabs -1',
      'Every tab 0; active panel -1',
      'Every tab -1; document body 0',
      'Active tab 1; others sequential positive values',
    ],
    [
      'One tab is in the document Tab sequence; arrow navigation updates the active focusable tab.',
      'Every tab at zero creates multiple entry points rather than roving focus.',
      'Removing every tab from the sequence makes the widget hard to enter.',
      'Positive tabindex establishes a separate global focus order and is unnecessary.',
    ],
  ],
  [
    'fe-mf-derived',
    'State design',
    'A selected-item count drifts from the selected ID array after clearing a filter. Which state model removes the inconsistency class?',
    [
      'Derive the count from selected IDs',
      'Store the count in a second global store',
      'Recount only on the next pointer interaction',
      'Update the count in an independent timeout',
    ],
    [
      'A derived count has no separate update path that can diverge.',
      'Another store adds another synchronized copy.',
      'Delayed correction still leaves incorrect visible state.',
      'Independent timers introduce ordering and stale-update risks.',
    ],
  ],
  [
    'fe-mf-url',
    'State design',
    'A results page needs reload and Back to restore filters, but its unfinished search draft should not add history entries on every keystroke. What boundary fits?',
    [
      'Commit navigable filters to the URL',
      'Push the entire form draft on every change',
      'Store committed filters only in a module variable',
      'Read the URL once and ignore later navigation',
    ],
    [
      'Separate editable draft from committed navigation state and update the URL at the chosen commit boundary.',
      'That creates noisy history and confuses unfinished input with navigation intent.',
      'Module memory does not survive reload or provide meaningful history.',
      'Back and Forward must update the rendered committed state.',
    ],
  ],
  [
    'fe-mf-layout',
    'Performance',
    'Why can alternating these operations become expensive across hundreds of rows?',
    [
      'Reads may force layout after each write',
      'offsetWidth always downloads font files',
      'style.width creates a network transaction',
      'The browser cannot cache any CSS declarations',
    ],
    [
      'A layout-dependent read after a geometric write can synchronously flush pending layout repeatedly.',
      'Reading dimensions does not inherently download fonts on each call.',
      'Setting an inline width does not create a network request.',
      'Browsers cache style work, but forced synchronization can defeat useful batching.',
    ],
    'for (const row of rows) {\n  row.style.width = container.offsetWidth + "px";\n}',
  ],
  [
    'fe-mf-mock',
    'Testing',
    'A search test stubs the filtering function to return expected rows, then asserts those rows. What important behavior remains untested?',
    [
      'Whether the real filter selects correct rows',
      'Whether the test runner can construct arrays',
      'Whether a browser supports literal text nodes',
      'Whether the stub can return its configured value',
    ],
    [
      'Mocking the logic under test bypasses the selection behavior that may be defective.',
      'Array construction is language behavior rather than the feature contract.',
      'Text node support is not the missing business behavior.',
      'The stub’s configured response is precisely what the test already exercises.',
    ],
  ],
  [
    'fe-mf-identity',
    'State design',
    'Editable rows keep their local draft by list position. Sorting moves draft text to another record. What identity should bind each draft?',
    [
      'The stable record ID',
      'The current sorted index',
      'The row’s currently displayed title',
      'The row’s alternating background color',
    ],
    [
      'A stable ID follows the same record through reordering.',
      'Index changes with sorting and caused the misassociation.',
      'Titles may change or collide and do not establish record identity.',
      'Presentation styles repeat and are not identifiers.',
    ],
  ],
  [
    'fe-mf-resize',
    'CSS and layout',
    'A reusable card can sit in a narrow sidebar or a wide main area at the same viewport size. Which signal should drive its internal layout?',
    [
      'The card container’s available width',
      'The physical display’s pixel count',
      'The route name selected by the host app',
      'The full viewport width in every placement',
    ],
    [
      'Container-aware layout responds to the space actually allocated to the component.',
      'Physical pixels do not describe its CSS layout allocation.',
      'Routes are indirect and brittle proxies for dimensions.',
      'The same viewport can contain substantially different card widths.',
    ],
  ],
];

const midPractical: Entry[] = [
  [
    'fe-mp-finally',
    'Async data',
    'After a new search starts, an older request finishes and hides the new spinner. Which ownership check is missing?',
    [
      'Guard finalization with the current request ID',
      'Move loading=false into every catch block',
      'Wait for the old response before starting a query',
      'Read the input text only after setting loading=false',
    ],
    [
      'Loading, results, and errors all belong to the current request; stale finally blocks must not mutate them.',
      'A stale failure can still clear another request’s loading state.',
      'Serializing searches sacrifices responsiveness and does not express current ownership.',
      'Reading text after mutation does not prevent the stale state update.',
    ],
    'try { await search(query); }\nfinally { loading = false; }',
  ],
  [
    'fe-mp-page',
    'State design',
    'A user is on page 8, then narrows a filter to six matching records. The UI shows “no results.” Which transition is missing?',
    [
      'Reset pagination when the filter changes',
      'Keep page 8 and retry its request twice',
      'Treat the empty page as an authentication error',
      'Increase the page size after every filter change',
    ],
    [
      'The old page position is invalid for the new dataset; reset or clamp by a documented policy.',
      'Retries return the same out-of-range page.',
      'An empty page is not evidence that credentials failed.',
      'Changing page size changes navigation semantics and does not reliably repair the position.',
    ],
  ],
  [
    'fe-mp-optimistic',
    'State design',
    'A failed optimistic rename restores the whole old list, erasing another row’s successful update. Which rollback scope is appropriate?',
    [
      'Reconcile the affected mutation by identity',
      'Restore the snapshot after a longer delay',
      'Reload the page before processing any response',
      'Keep the failed rename and mark the list current',
    ],
    [
      'A scoped rollback or version-aware reconciliation preserves unrelated confirmed changes.',
      'Delay does not make the old full-list snapshot current.',
      'Reloading is disruptive and does not provide a correct mutation reconciliation model.',
      'A rejected change must not masquerade as confirmed data.',
    ],
  ],
  [
    'fe-mp-etag',
    'Async data',
    'Two tabs edit the same document. The API supports version preconditions and rejects stale writes. What should the client send with its update?',
    [
      'The version from the loaded document',
      'The current client timestamp as the version',
      'The tab’s index in the browser window',
      'The new document title as the precondition',
    ],
    [
      'The loaded version lets the server detect whether the edit was based on stale data.',
      'A client timestamp is not the server’s version and can differ by clock or precision.',
      'Browser tab position has no relation to document concurrency.',
      'A mutable title is not the API’s version precondition.',
    ],
  ],
  [
    'fe-mp-file',
    'Security',
    'An avatar picker accepts only image extensions, but the upload endpoint receives other content. What assumption should change?',
    [
      'Client accept filters are not server validation',
      'The filename extension proves the media format',
      'A hidden file input makes selected bytes trusted',
      'The preview URL verifies the uploaded file policy',
    ],
    [
      'The server must enforce type, size, and other upload rules because client restrictions are bypassable.',
      'Extensions can be renamed and are not sufficient evidence of content.',
      'Visibility of the control does not establish trust.',
      'Displaying a preview is not equivalent to validating server upload requirements.',
    ],
  ],
  [
    'fe-mp-focus-delete',
    'Accessibility',
    'Deleting the focused row removes its action button. Which behavior maintains a useful keyboard position?',
    [
      'Focus a neighboring row action or list heading',
      'Focus the browser address bar after deletion',
      'Keep the focus reference to the detached button',
      'Move focus to the page footer for consistency',
    ],
    [
      'A nearby surviving control or meaningful empty-list destination preserves context.',
      'The address bar leaves the workflow and is generally outside page focus control.',
      'A detached element cannot serve as a usable next interaction point.',
      'The footer is unrelated to the user’s list task.',
    ],
  ],
  [
    'fe-mp-modal',
    'Accessibility',
    'A custom modal visually covers the page, yet Tab reaches background checkout controls. What behavior is incomplete?',
    [
      'Background inertness and contained focus',
      'The overlay’s background color opacity',
      'The close icon’s visual border radius',
      'The modal’s asynchronous data loading policy',
    ],
    [
      'A modal must prevent interaction outside its active scope and manage keyboard focus.',
      'Opacity changes appearance without removing background controls from interaction.',
      'Icon styling does not govern focus containment.',
      'Data loading does not establish modal focus behavior.',
    ],
  ],
  [
    'fe-mp-composition',
    'Forms',
    'A search field submits on Enter while a user is confirming an IME composition. Which condition should the shortcut account for?',
    [
      'Whether the key event is composing text',
      'Whether the field currently has any letters',
      'Whether the search results are already cached',
      'Whether the input has a visible placeholder',
    ],
    [
      'Composition confirmation is part of text entry; the submission shortcut should respect that state.',
      'Nonempty text does not distinguish confirmation from submission.',
      'Caching does not change the user’s text-composition intent.',
      'Placeholder visibility is unrelated to key composition semantics.',
    ],
  ],
  [
    'fe-mp-observer',
    'Performance',
    'An infinite-scroll sentinel keeps fetching after the view is removed. What teardown is needed in addition to ignoring stale responses?',
    [
      'Disconnect its intersection observer',
      'Set the removed sentinel’s text to empty',
      'Increase the pagination request timeout',
      'Move its observer callback to another module',
    ],
    [
      'Disconnecting stops the observation resource and avoids future callbacks from that subscription.',
      'Text content does not unregister observation.',
      'A longer timeout does not stop unwanted work.',
      'Module location does not change lifecycle ownership.',
    ],
  ],
  [
    'fe-mp-cache-key',
    'Async data',
    'A cached user list shows one tenant’s names after switching tenants. Both queries use key="users". Which repair addresses isolation?',
    [
      'Include tenant identity in the cache key',
      'Shorten the cache lifetime by one second',
      'Alphabetize the names before caching them',
      'Use the same cache key with a longer timestamp',
    ],
    [
      'The cache identity must include inputs that change the data’s authorization scope.',
      'A short lifetime still permits cross-tenant reuse before expiration.',
      'Sorting does not isolate data by tenant.',
      'A timestamp is not an explicit partition by tenant and obscures reuse semantics.',
    ],
  ],
  [
    'fe-mp-resize-loop',
    'CSS and layout',
    'A ResizeObserver callback changes the observed element’s width, causing repeated notifications. What design reduces the feedback loop?',
    [
      'Avoid writes that retrigger the same size condition',
      'Observe the same element with two observers',
      'Read its width twice before every write',
      'Use a larger random width on each notification',
    ],
    [
      'Idempotent sizing and separation of measurement from mutation prevent self-sustaining changes.',
      'A second observer adds callbacks without removing the causal loop.',
      'Repeated reads do not make a size-changing write stable.',
      'Random size changes perpetuate instability.',
    ],
  ],
  [
    'fe-mp-passive',
    'JavaScript and browser',
    'A touch listener registered as passive cannot prevent the page from scrolling. Which diagnosis fits?',
    [
      'Passive promises not to cancel default behavior',
      'preventDefault only works on mouse events',
      'Scroll cancellation needs stopPropagation instead',
      'The listener must return false after any callback',
    ],
    [
      'If cancellation is necessary, use an appropriate non-passive listener and consider a touch-action design.',
      'Cancelable touch events can support preventDefault in suitable listeners.',
      'Propagation and default behavior are different event mechanisms.',
      'Returning false from an addEventListener callback does not cancel the default action.',
    ],
    'surface.addEventListener("touchmove", e => e.preventDefault(), { passive: true });',
  ],
  [
    'fe-mp-allsettled',
    'Async data',
    'A dashboard can display balances even when recommendations fail. Which orchestration best preserves independent outcomes?',
    [
      'Handle each result or use allSettled',
      'Throw away balances when either request rejects',
      'Retry both requests until their values match',
      'Combine both responses into one shared boolean',
    ],
    [
      'Separate settled outcomes support independent rendering and localized failure feedback.',
      'Coupling unrelated failures removes usable information.',
      'The responses have different meanings and cannot be expected to match.',
      'A boolean loses the data and individual error states.',
    ],
  ],
  [
    'fe-mp-race-test',
    'Testing',
    'A search fix passes when requests resolve in start order. What controlled test would challenge its stale-result guard?',
    [
      'Resolve the newer result, then the older one',
      'Repeat one request ten times sequentially',
      'Wait a fixed second after each request starts',
      'Assert the debounce timer is created once',
    ],
    [
      'An older late response is the ordering that must not replace the current view.',
      'Sequential completion avoids the race condition.',
      'Fixed waits do not establish a reproducible completion order.',
      'Debouncing does not prove response ownership.',
    ],
  ],
  [
    'fe-mp-shift-test',
    'Performance',
    'Lab traces show layout shifts only after a consent message appears. What measurement isolates the cause?',
    [
      'Inspect shifted nodes and message insertion timing',
      'Compare the minified JavaScript file names',
      'Count the total number of network requests',
      'Measure only the final screenshot’s image size',
    ],
    [
      'Attribution connects the shift to newly inserted geometry and affected elements.',
      'File names cannot identify which geometry moved.',
      'Request count is indirect and may be unchanged.',
      'A final image omits the temporal movement.',
    ],
  ],
  [
    'fe-mp-sticky',
    'CSS and layout',
    'A sticky header stopped tracking page scroll after a wrapper gained overflow:auto. Which relationship should be inspected first?',
    [
      'The sticky element’s scrolling ancestor',
      'The font weight of the header title',
      'The image format of the logo asset',
      'The array order of navigation items',
    ],
    [
      'Sticky positioning is constrained by its scroll container; the wrapper can change that relationship.',
      'Text weight does not normally change the scroll-container relationship.',
      'Image format is unrelated to the positioning reference.',
      'Data ordering does not identify the container governing sticky behavior.',
    ],
  ],
  [
    'fe-mp-sanitizer',
    'Security',
    'A rich-text comment must allow selected formatting. What distinguishes its rendering policy from a plain display-name field?',
    [
      'Sanitize permitted HTML before using an HTML sink',
      'Use textContent and expect formatting to render',
      'Remove angle brackets from the CSS classes only',
      'Trust markup when it came from an authenticated user',
    ],
    [
      'Formatted HTML requires a maintained allowlist sanitizer and a carefully controlled sink.',
      'textContent is safe for plain text but deliberately does not render formatting.',
      'Class edits do not sanitize element, URL, or attribute injection.',
      'Authentication identifies a user; it does not make submitted markup safe.',
    ],
  ],
  [
    'fe-mp-announcement',
    'Accessibility',
    'Search updates every keystroke and a live region reads every intermediate result, overwhelming users. Which feedback policy better matches the interaction?',
    [
      'Announce settled results at a useful boundary',
      'Make every result change assertive',
      'Move keyboard focus to results after each letter',
      'Repeat the current input in a second live region',
    ],
    [
      'A concise settled update communicates the outcome without announcing every transient state.',
      'Assertive announcements can interrupt ongoing reading even more.',
      'Forced focus movement interferes with continued typing.',
      'A second redundant region adds noise rather than useful information.',
    ],
  ],
  [
    'fe-mp-timezone',
    'JavaScript and browser',
    'An event timestamp includes Z, but users in different zones see different local clock times. What does Z establish?',
    [
      'The timestamp represents a UTC instant',
      'The event’s venue timezone is the viewer’s zone',
      'The displayed local clock time must be identical',
      'The date value contains no timezone information',
    ],
    [
      'Z identifies UTC; formatting that instant locally can yield different clock times.',
      'UTC notation does not encode the venue’s named time zone.',
      'Local formatting applies the viewer’s zone, so clock times can differ.',
      'Z explicitly conveys UTC rather than an unspecified local time.',
    ],
    'new Date("2026-10-27T08:00:00Z").toLocaleTimeString();',
  ],
  [
    'fe-mp-persistence',
    'State design',
    'The server rejects a draft, but a “Saved” badge remains because local persistence succeeded. Which states need separation?',
    [
      'Saved locally and confirmed by the server',
      'Input focused and pointer hovering',
      'Desktop layout and tablet layout',
      'Current route and browser language',
    ],
    [
      'Local durability and remote confirmation are distinct guarantees and need honest labels.',
      'Focus and hover do not establish persistence.',
      'Layout breakpoints do not indicate saving success.',
      'Navigation and locale are unrelated to the rejected write.',
    ],
  ],
  [
    'fe-mp-e2e',
    'Testing',
    'A component test passes with mocked navigation, but Back restores the wrong filter in production. Which test boundary is missing?',
    [
      'Real browser history with filter navigation',
      'A snapshot of the mocked navigation function',
      'A unit test of string concatenation',
      'A rendering test with one fixed filter value',
    ],
    [
      'A browser journey through commits and Back exercises history synchronization.',
      'Inspecting the mock does not verify browser semantics or application listeners.',
      'Concatenation is narrower than the state restoration behavior.',
      'One static state misses transitions and history.',
    ],
  ],
  [
    'fe-mp-worker',
    'Performance',
    'Filtering 100,000 records takes 180ms of CPU time and blocks typing. Which change moves that computation off the UI thread?',
    [
      'Compute in a Web Worker',
      'Wrap the same loop in Promise.resolve().then',
      'Invoke the loop inside requestAnimationFrame',
      'Increase the debounce while retaining the loop',
    ],
    [
      'A worker can run the computation separately; account for message transfer and stale results.',
      'A promise callback still executes on the main thread.',
      'Animation callbacks run on the main thread before paint and can block it.',
      'Debouncing reduces frequency but each remaining long task still blocks interaction.',
    ],
  ],
  [
    'fe-mp-disabled',
    'Forms',
    'A disabled account ID is absent from new FormData(form). The server needs the value but users must not edit it. Which native text-input state is a closer fit?',
    [
      'Use readonly on the text input',
      'Keep disabled and change its placeholder',
      'Set aria-hidden on the disabled input',
      'Remove the field’s name attribute',
    ],
    [
      'Readonly text inputs can remain successful form controls; the server must still validate the ID.',
      'Placeholder text does not include a disabled control in form submission.',
      'Hiding from accessibility does not change successful-control rules.',
      'Without a name, the control cannot contribute the expected form entry.',
    ],
  ],
  [
    'fe-mp-memory',
    'Performance',
    'A preview tool creates a new object URL for every selected file. Memory grows during long sessions. What lifecycle action is missing?',
    [
      'Revoke obsolete object URLs',
      'Clear the input’s CSS background color',
      'Convert every filename to lowercase',
      'Use the same DOM id for each preview',
    ],
    [
      'URL.revokeObjectURL releases an object URL when no longer needed; retain the active one until safe to release.',
      'Background color has no relation to the blob URL registry.',
      'Filename casing does not release binary resources.',
      'DOM IDs do not govern object URL lifetime.',
    ],
  ],
];

const seniorFundamentals: Entry[] = [
  [
    'fe-sf-consistency',
    'State design',
    'A shared entity appears in a table, detail pane, and optimistic editor. Independent copies drift after partial updates. Which ownership model most directly reduces conflicting truth?',
    [
      'One canonical entity store with scoped drafts',
      'One independently writable copy per visual surface',
      'A timer that periodically copies table data to others',
      'A shared boolean indicating that some copy changed',
    ],
    [
      'Canonical server state plus explicit local drafts distinguishes authoritative data from uncommitted work.',
      'Independent writable copies require complex synchronization and permit divergence.',
      'Periodic copying creates stale windows and can overwrite unfinished edits.',
      'A boolean lacks entity identity, version, and reconciliation semantics.',
    ],
  ],
  [
    'fe-sf-abort',
    'Async data',
    'A client aborts a POST after sending its body. Which conclusion is safe when deciding whether to offer a retry?',
    [
      'The server outcome may still be unknown',
      'The server must have rolled back the transaction',
      'The server cannot have read any submitted bytes',
      'The next identical request cannot create a duplicate',
    ],
    [
      'Client cancellation does not prove server rollback; reconcile or use a server-backed idempotency contract.',
      'AbortController governs the client operation, not a server transaction guarantee.',
      'The request may already have reached the server before cancellation.',
      'Safe retry requires an idempotency or reconciliation policy, not merely an aborted client.',
    ],
  ],
  [
    'fe-sf-microtask',
    'Performance',
    'A developer chunks expensive work using await Promise.resolve() between chunks. Input remains blocked. What scheduling issue explains it?',
    [
      'The microtask chain can delay task and paint work',
      'Await always starts a dedicated worker thread',
      'Promise resolution forces a paint after each chunk',
      'The browser disables input while any promise exists',
    ],
    [
      'Continuously queued microtasks can monopolize a checkpoint; yielding to an appropriate task or worker boundary differs.',
      'Await resumes asynchronously but does not create a worker.',
      'A microtask boundary does not guarantee a rendering opportunity.',
      'Pending promises do not inherently disable input; long continuous execution does.',
    ],
    'while (remaining()) {\n  processChunk();\n  await Promise.resolve();\n}',
  ],
  [
    'fe-sf-hydration',
    'Rendering architecture',
    'Server HTML formats a timestamp using the server locale; the client’s initial render uses the user locale. Which contract prevents inconsistent initial content?',
    [
      'Use a deterministic initial format on both sides',
      'Suppress every mismatch warning in the application',
      'Delay downloading CSS until formatting finishes',
      'Assign a different random ID to each timestamp',
    ],
    [
      'Initial server and client output must agree; later client personalization can be an explicit transition.',
      'Suppressing warnings conceals inconsistent output without defining a rendering contract.',
      'CSS loading does not align text generation.',
      'Random IDs introduce further nondeterminism.',
    ],
  ],
  [
    'fe-sf-inert',
    'Accessibility',
    'A portal renders a dialog outside the app root. Applying inert to the entire body disables the dialog too. What boundary should be modeled?',
    [
      'Background siblings of the active modal scope',
      'Every descendant of the document body',
      'Only focusable nodes present when the modal opened',
      'Only the portal’s immediate sibling elements',
    ],
    [
      'The active modal must remain interactive while relevant background regions are inert.',
      'The modal is also a body descendant, so this repeats the failure.',
      'A one-time focusable-node list can miss later background controls and non-focus interaction.',
      'Immediate portal siblings may omit other interactive background branches in the document.',
    ],
  ],
  [
    'fe-sf-tokens',
    'CSS and layout',
    'A theme token named surface is reused for both text backgrounds and control borders. Dark mode needs different contrast relationships for those roles. What refactoring creates a stable semantic contract?',
    [
      'Split tokens by intended visual role',
      'Copy current hex values into every consumer',
      'Use a brighter surface value for all usages',
      'Add route-specific overrides for each screenshot',
    ],
    [
      'Role-based tokens let each contrast relationship evolve without coupling unrelated usages.',
      'Copied literals fragment ownership and make future changes inconsistent.',
      'One value still couples incompatible contrast requirements.',
      'Route exceptions encode incidental layouts rather than reusable roles.',
    ],
  ],
  [
    'fe-sf-budget',
    'Performance',
    'A smaller JavaScript bundle ships, but checkout interaction latency worsens on low-end devices. Which conclusion follows?',
    [
      'Transfer size did not capture the CPU regression',
      'The size reduction proves the checkout is faster',
      'Only server response timing can explain the latency',
      'The device segment can be excluded from evaluation',
    ],
    [
      'Bundle bytes and interaction execution cost are different measurements; profile the regressed journey.',
      'Fewer bytes cannot prove lower processing or rendering latency.',
      'Client computation and rendering can dominate interaction delay.',
      'Removing affected users from measurement hides the regression rather than explaining it.',
    ],
  ],
  [
    'fe-sf-xss-policy',
    'Security',
    'A strict Content Security Policy is added to a page that still interpolates untrusted strings into HTML. What security posture is justified?',
    [
      'Keep safe sinks and treat CSP as another layer',
      'Treat the policy as a complete sanitizer substitute',
      'Allow HTML interpolation when a nonce is present',
      'Remove output handling after the first clean report',
    ],
    [
      'CSP can limit exploitation but does not replace correct data handling and HTML sanitization.',
      'A response policy does not sanitize generated DOM.',
      'A script nonce is not permission to interpret arbitrary input safely.',
      'Clean reports do not establish that all injection paths are safe.',
    ],
  ],
  [
    'fe-sf-testing',
    'Testing',
    'A shared combobox passes snapshots but a dependent app cannot operate it with a screen reader. Which missing contract would have caught the gap most directly?',
    [
      'Interaction and accessible-state behavior',
      'The internal helper function naming convention',
      'The total number of lines in the component',
      'An exact snapshot of its compiled bundle bytes',
    ],
    [
      'Focus, keyboard handling, names, roles, and exposed states define usability beyond appearance.',
      'Naming conventions cannot establish assistive-technology behavior.',
      'Size of source code is unrelated to the behavioral contract.',
      'Compiled-byte snapshots detect builds, not whether the widget is usable.',
    ],
  ],
  [
    'fe-sf-referential',
    'State design',
    'A shallow-equality subscriber misses this profile update. Which invariant was broken?',
    [
      'Changed data needs a new observed reference',
      'All nested objects must be serialized each render',
      'A new wrapper around the same profile is sufficient',
      'Subscribers should compare only top-level key counts',
    ],
    [
      'Mutating the same observed object defeats reference-based change detection; copy the changed path.',
      'Serialization is not a prerequisite for immutable updates.',
      'A subscriber selecting the unchanged profile reference can still miss the mutation despite a new outer wrapper.',
      'Key counts can remain constant while existing property values change.',
    ],
    'const next = state;\nnext.profile.name = "Amira";\nnotify(next);',
  ],
  [
    'fe-sf-cache-auth',
    'Security',
    'A client cache persists across logout and a different user signs in. Which invalidation boundary is essential?',
    [
      'The authenticated principal and authorization scope',
      'Only the currently selected presentation theme',
      'Only queries that failed in the previous session',
      'The application’s most recent build timestamp',
    ],
    [
      'Sensitive cached data must not cross principal or privilege boundaries.',
      'Theme changes do not partition access to private data.',
      'Successfully fetched data can be the sensitive content needing removal.',
      'A build identifier does not distinguish users sharing the same client.',
    ],
  ],
  [
    'fe-sf-progressive',
    'Rendering architecture',
    'A public application form must remain submittable when enhancement JavaScript fails. Which architecture supports this constraint?',
    [
      'A native form endpoint with optional enhancement',
      'A clickable div that calls a bundled submit helper',
      'A client-only shell with an early loading spinner',
      'A hidden form whose action is assigned after hydration',
    ],
    [
      'A functional HTML submission contract can be enhanced while retaining a baseline path.',
      'A JavaScript-dependent click helper disappears when the enhancement fails.',
      'A shell alone provides no form submission without script execution.',
      'An action that depends on hydration is absent under the stated failure.',
    ],
  ],
];

const seniorPractical: Entry[] = [
  [
    'fe-sp-mutation-order',
    'State design',
    'A user renames a record twice. The second write succeeds, then the first write fails. Rolling back the first operation restores the original name. Which reconciliation rule avoids erasing the confirmed edit?',
    [
      'Apply rollback only to its still-current mutation',
      'Restore the first snapshot after every failure',
      'Roll back by record ID without checking edit version',
      'Use response arrival as the authoritative edit order',
    ],
    [
      'Mutation identity or version ownership prevents an obsolete failure from undoing a later confirmed change.',
      'An old snapshot predates the successful later edit.',
      'Record identity scopes the entity, but a version or operation identity is also needed for successive edits.',
      'Network completion order can differ from the intended update order.',
    ],
  ],
  [
    'fe-sp-publish',
    'Async data',
    'Publishing times out after the server may have committed. Retrying with a new operation ID can duplicate the publication. What should the client workflow use?',
    [
      'Reconcile status or reuse an idempotency key',
      'Create a new request ID for every retry attempt',
      'Show a definite failure and clear the local draft',
      'Repeat the POST until a response arrives within 1s',
    ],
    [
      'A stable operation identity and status reconciliation handle an uncertain result without duplicating the command.',
      'A new identity can make each retry a new operation.',
      'Timeout does not prove failure; clearing the draft also removes recovery context.',
      'Unbounded blind retries can multiply completed publications.',
    ],
  ],
  [
    'fe-sp-migration',
    'Architecture',
    'A new shared dialog changes Escape behavior and focus restoration. Twenty teams use the old contract. Which rollout provides useful compatibility evidence?',
    [
      'Pilot critical flows with explicit contract tests',
      'Replace imports globally once visual snapshots pass',
      'Ship under the old version without release notes',
      'Collect only download counts for the new package',
    ],
    [
      'Representative flows and interaction contracts expose behavioral breaks before broad adoption.',
      'Visual snapshots omit keyboard and focus semantics.',
      'Silent behavioral changes prevent consumers planning compatibility work.',
      'Downloads indicate acquisition, not whether affected workflows still operate.',
    ],
  ],
  [
    'fe-sp-percentile',
    'Performance',
    'Aggregate interaction latency improves, but the p75 for low-end devices worsens after rollout. What release decision best matches an inclusive performance budget?',
    [
      'Evaluate the regressed segment against its budget',
      'Approve because the overall average improved',
      'Replace percentile metrics with bundle bytes',
      'Measure only users with the newest browser version',
    ],
    [
      'Segment budgets prevent broad averages hiding material harm to a user group.',
      'An average can hide distribution changes and disadvantaged cohorts.',
      'Bundle bytes do not resolve the interaction regression.',
      'Narrowing coverage excludes affected users rather than addressing their experience.',
    ],
  ],
  [
    'fe-sp-virtual-focus',
    'Accessibility',
    'A virtual list unmounts the focused option while scrolling. The design also uses aria-activedescendant. Which invariant must the implementation preserve?',
    [
      'The referenced active option remains in the DOM',
      'Every dataset item must be rendered at all times',
      'The active ID can point to an unmounted template',
      'Visual selection can replace active-descendant state',
    ],
    [
      'The active-descendant relationship needs an existing valid element; retain or deliberately transfer the active item.',
      'Rendering the entire dataset is one possible fallback, but is not the required minimal invariant.',
      'A missing referenced element cannot expose the intended active option.',
      'Visual styling does not provide the semantic active-descendant relationship.',
    ],
  ],
  [
    'fe-sp-worker-stale',
    'Async data',
    'Moving search into a worker fixes typing latency but old worker results still replace new queries. Which protocol field addresses correctness?',
    [
      'A generation ID echoed with each result',
      'The number of matching rows in each result',
      'The elapsed computation time of each result',
      'The timestamp when each result reaches the UI',
    ],
    [
      'A generation ID lets the main thread reject results that no longer belong to its active query.',
      'Result size does not establish which query owns the current view.',
      'A faster computation may belong to an older query; duration is not identity.',
      'Receipt time measures completion order, which can differ from query order.',
    ],
  ],
  [
    'fe-sp-deploy-chunk',
    'Rendering architecture',
    'After deployment, an old open tab requests a removed lazy chunk and the route fails. Which deployment policy directly reduces this failure mode?',
    [
      'Retain versioned assets for active clients',
      'Rename every chunk to the same unversioned file',
      'Cache the HTML indefinitely in the browser',
      'Retry the same missing URL without a limit',
    ],
    [
      'Keeping immutable assets for a compatibility window supports clients that still reference the previous manifest.',
      'A shared name risks serving incompatible code to different versions.',
      'Long-lived HTML can prolong references to removed assets.',
      'Retries cannot retrieve a permanently removed resource; recovery also needs a bounded policy.',
    ],
  ],
  [
    'fe-sp-offline-edit',
    'State design',
    'An offline editor reconnects after another user changed the same field. What must precede silently replaying the queued edit?',
    [
      'A version/conflict reconciliation decision',
      'Replaying operations in local creation order',
      'Clearing all local operations from storage',
      'Changing every timestamp to the reconnect time',
    ],
    [
      'The client needs a conflict policy based on the version edited and current server state.',
      'Local order preserves this client’s sequence but does not reconcile intervening server edits.',
      'Dropping queued edits discards work without resolution.',
      'Changing timestamps hides chronology and does not establish correctness.',
    ],
  ],
  [
    'fe-sp-csp-rollout',
    'Security',
    'A stricter CSP is expected to break unknown third-party integrations. Which rollout balances evidence gathering with enforcement?',
    [
      'Analyze report-only violations, then enforce',
      'Treat report-only mode as permanent prevention',
      'Allow all script sources until traffic decreases',
      'Remove the policy on routes with sensitive data',
    ],
    [
      'A staged report-only phase identifies dependencies before a deliberately enforced policy rollout.',
      'Report-only collects evidence but does not block violations.',
      'An unrestricted policy does not achieve the intended restriction.',
      'Sensitive routes particularly need a deliberate security posture, not policy removal.',
    ],
  ],
  [
    'fe-sp-postmessage',
    'Security',
    'A page accepts account data from an embedded widget through postMessage. Which checks establish the expected sender boundary before using the payload?',
    [
      'Validate origin, source, and payload shape',
      'Accept any event containing an accountId string',
      'Trust messages when the widget is visible',
      'Check only whether event.data is valid JSON',
    ],
    [
      'An expected origin and window source establish sender context; schema validation constrains data.',
      'A field name is easy for another sender to reproduce.',
      'Visibility does not prove which window sent a message.',
      'Syntactically valid JSON is not sender authentication or semantic validation.',
    ],
    'window.addEventListener("message", event => updateAccount(event.data));',
  ],
  [
    'fe-sp-scroll-lock',
    'CSS and layout',
    'Two overlays independently set body overflow to hidden and restore it on close. Closing the top overlay unlocks the page beneath the remaining modal. What ownership model avoids this?',
    [
      'A shared lock manager with balanced acquisition',
      'Each overlay restores overflow on any click',
      'The newest overlay overwrites every older cleanup',
      'A timer periodically reapplies overflow:hidden',
    ],
    [
      'Track active lock owners and restore the prior style only when the last owner releases.',
      'Click-based restoration can unlock while any modal remains active.',
      'Overwriting cleanup loses ownership and can leave either leaks or early unlocks.',
      'Periodic reapplication permits flicker and does not establish correct lifecycle behavior.',
    ],
  ],
  [
    'fe-sp-promise-cache',
    'Async data',
    'A request cache stores a rejected promise forever. A recovered network still shows failure on each retry. What cache policy should change?',
    [
      'Evict or explicitly invalidate failed entries',
      'Attach another catch while retaining the same entry',
      'Rename the cache variable on every render',
      'Use a longer success-cache lifetime for failures',
    ],
    [
      'A failed promise cannot become a new successful request; retry must create a new operation under a defined policy.',
      'Another observer of the same rejection does not issue a fresh request.',
      'Variable naming does not change the stored rejected promise.',
      'Extending failure retention makes recovery slower rather than possible.',
    ],
    'cache.set(key, fetchData(key));\nreturn cache.get(key);',
  ],
  [
    'fe-sp-cache-schema',
    'Rendering architecture',
    'A persisted client cache from version 1 contains fields that version 2 interprets differently. Which startup behavior is required?',
    [
      'Version and migrate or invalidate persisted data',
      'Assume compile-time types validate stored JSON',
      'Cast parsed objects to the new interface',
      'Wait for a render error before deciding to clear it',
    ],
    [
      'Persisted data is an external boundary; schema versioning defines compatibility and recovery.',
      'Compile-time types do not inspect runtime persisted values.',
      'A cast changes the type checker’s view, not the data shape.',
      'Render failures are a late and unreliable compatibility detection mechanism.',
    ],
  ],
  [
    'fe-sp-experiment',
    'Performance',
    'An experiment makes early rendering faster but increases abandoned submissions. What evidence is needed before attributing the business effect to the change?',
    [
      'Comparable cohorts and journey-level guardrails',
      'The fastest recorded run of the new rendering path',
      'The overall number of code modules removed',
      'A screenshot demonstrating the new empty state',
    ],
    [
      'Comparable exposure and relevant completion/error metrics help distinguish benefit, harm, and confounding factors.',
      'A best-case run cannot explain user completion outcomes.',
      'Module count is not evidence for the abandonment change.',
      'A screenshot does not establish experiment attribution or behavior.',
    ],
  ],
  [
    'fe-sp-telemetry',
    'Security',
    'Error reports currently include serialized form state to debug checkout failures. Which redesign preserves diagnostic value with less exposure?',
    [
      'Allowlist sanitized fields and operation metadata',
      'Hash the full form and store the original beside it',
      'Collect raw values only for failed submissions',
      'Base64-encode form state before logging it',
    ],
    [
      'An explicit diagnostic schema can retain categories, versions, and safe identifiers while excluding payment and personal contents.',
      'Keeping the original leaves the exposure unchanged.',
      'Failure does not make sensitive input safe to collect.',
      'Base64 is reversible encoding, not privacy protection.',
    ],
  ],
  [
    'fe-sp-css-layer',
    'CSS and layout',
    'A component package needs consumers to override normal styles predictably without increasing selector specificity. Which distribution contract helps?',
    [
      'Publish low-priority styles in an agreed layer',
      'Add !important to every package declaration',
      'Generate new random class names on each mount',
      'Require consumers to repeat the package selector chain',
    ],
    [
      'A documented layer order creates an explicit cascade boundary for normal declarations.',
      'Important declarations escalate overrides and use different layer precedence rules.',
      'Random names make targeted overrides unstable.',
      'Repeating selector structure couples consumers to internal markup.',
    ],
  ],
  [
    'fe-sp-partial',
    'Rendering architecture',
    'A dashboard shell succeeds while one independently loaded panel fails. The fallback clears the entire workspace, including an unsaved draft. Where should recovery be scoped?',
    [
      'At the failing panel’s meaningful boundary',
      'At the highest application root for every error',
      'In a shared fetch wrapper that returns empty data',
      'In the route loader before replacing the entire shell',
    ],
    [
      'A meaningful feature boundary isolates failure while preserving unrelated useful state.',
      'Root replacement unnecessarily destroys unaffected work.',
      'Converting failures into empty data hides errors and does not define the panel’s recovery interaction.',
      'Replacing the route shell can still remove the unrelated draft; the intended boundary is narrower.',
    ],
  ],
  [
    'fe-sp-flaky',
    'Testing',
    'A test waits two seconds for an optimistic row to reconcile and flakes on slower CI machines. What change tests the contract more reliably?',
    [
      'Control the response and await the observable state',
      'Raise the fixed delay to twenty seconds',
      'Assert the optimistic row before any response',
      'Retry the whole suite until the flake disappears',
    ],
    [
      'Deterministic response timing plus a state assertion targets completion instead of wall-clock luck.',
      'A larger delay slows feedback and still lacks a causal completion condition.',
      'That skips the reconciliation phase where the bug occurs.',
      'Retries can conceal nondeterminism without validating behavior.',
    ],
  ],
  [
    'fe-sp-contract-test',
    'Testing',
    'A dependency update preserves public props but changes keyboard behavior in an embedded date picker. Which consumer test is most valuable?',
    [
      'Exercise the supported keyboard selection journey',
      'Compare only the package lockfile version string',
      'Assert the dependency’s private helper call count',
      'Check that the component import still resolves',
    ],
    [
      'The keyboard journey verifies the behavior consumers and users rely on despite unchanged types.',
      'A version string identifies change but does not establish compatibility.',
      'Private helper calls are brittle and may not reflect user-visible semantics.',
      'Import success checks availability rather than interaction correctness.',
    ],
  ],
  [
    'fe-sp-longtask',
    'Performance',
    'A trace attributes a 240ms interaction delay to style and layout work after a small state update. What investigation should come before adding memoization?',
    [
      'Inspect invalidated geometry and DOM scope',
      'Memoize every data-fetch function in the app',
      'Compress the already cached response payload',
      'Increase the frequency of analytics sampling',
    ],
    [
      'The trace points to rendering work, so examine which update invalidates expensive layout and how far it propagates.',
      'Fetch memoization does not target the observed style/layout bottleneck.',
      'Transfer compression is unrelated to cached-response layout cost.',
      'More analytics samples provide no direct repair of the identified work.',
    ],
  ],
  [
    'fe-sp-reduced-motion',
    'Accessibility',
    'A new route transition provides spatial context but makes some users nauseous. What contract preserves meaning for reduced-motion users?',
    [
      'Offer a reduced-motion path with equivalent state cues',
      'Slow the animation while retaining its full travel',
      'Require users to disable all styles in the browser',
      'Remove route change feedback from every user',
    ],
    [
      'Respecting the preference while retaining concise non-motion cues communicates the same navigation outcome.',
      'Longer motion can extend discomfort and is not a reduced-motion strategy.',
      'Users should not need to break the interface to obtain usable navigation.',
      'The need is an equivalent alternative, not removing useful feedback universally.',
    ],
  ],
  [
    'fe-sp-refresh-token',
    'Async data',
    'Five requests fail with an expired session and each starts a refresh, causing token races. Which coordination policy reduces overlapping refreshes?',
    [
      'Share one in-flight refresh and retry within bounds',
      'Refresh on a timer in each requesting component',
      'Retry each original request indefinitely in parallel',
      'Treat the earliest failed request as successful',
    ],
    [
      'A single-flight refresh coordinates callers; bounded retries and final logout/error handling avoid loops.',
      'Independent component timers multiply coordination paths.',
      'Unbounded concurrent retries worsen load and can persist after unrecoverable failure.',
      'Falsely marking a request successful loses the operation result.',
    ],
  ],
  [
    'fe-sp-sw-update',
    'Rendering architecture',
    'A service worker update can activate while an old tab still has a draft and old application code. Which update design best respects this mixed-version state?',
    [
      'Plan compatibility and an explicit update transition',
      'Force immediate reload for every active editing tab',
      'Delete all old caches as soon as installation starts',
      'Assume old HTML and new assets are interchangeable',
    ],
    [
      'Version compatibility, cache lifecycle, and a draft-safe update path must be designed together.',
      'Immediate reload can discard unsaved work.',
      'Early deletion can break clients still referencing old resources.',
      'Different versions can have incompatible modules, schemas, or API expectations.',
    ],
  ],
  [
    'fe-sp-invariants',
    'Testing',
    'A reducer controls idle, saving, failed, and saved states. Many event sequences are possible. Which property would expose a dangerous transition bug?',
    [
      'A stale completion cannot mark a newer draft saved',
      'Every event returns a different outer object',
      'Every success event transitions directly to saved',
      'Each request start clears the existing draft',
    ],
    [
      'This checks operation ownership across sequences, preventing false confirmation of unsaved edits.',
      'New object identity can aid change detection but does not prove valid transitions or operation ownership.',
      'A success from an obsolete operation must not confirm the current draft.',
      'Clearing drafts on start loses work needed for recovery and does not protect against stale completions.',
    ],
  ],
];

const exercises: Record<Tier, { fundamentals: Exercise[]; practical: Exercise[] }> = {
  junior: {
    fundamentals: [
      {
        id: 'fe-j-ex-disclosure',
        title: 'Build an accessible FAQ disclosure',
        prompt:
          'Deliver a small HTML, CSS, and JavaScript FAQ with three independently expandable questions. Include a keyboard walkthrough and a short explanation of the relationship between each control and its answer.',
        reference:
          'Use native disclosure elements or buttons with explicit expanded state and panel relationships. Keep headings meaningful, preserve visible focus, and verify that collapsed content is not an unintended keyboard destination.',
        criteria: [
          'All three questions can be opened and closed by keyboard.',
          'Names and expanded state communicate the interaction.',
          'Collapsed panels have a deliberate focus policy.',
          'Long question text fits a narrow viewport.',
        ],
      },
      {
        id: 'fe-j-ex-card',
        title: 'Repair a responsive product card',
        prompt:
          'Deliver a product card containing a long title, image, price, and purchase link. Demonstrate it at 320px and 800px container widths and at 200% zoom. Explain the constraints that prevent overflow.',
        reference:
          'Use fluid sizing, reserved image proportions, wrapping text, and a real navigation link. Allow content to determine height rather than clipping translated or enlarged text.',
        criteria: [
          'The image reserves space before it loads.',
          'The title remains readable without page-level horizontal overflow.',
          'The purchase link has a meaningful accessible name.',
          'The deliverable includes the requested width and zoom checks.',
        ],
      },
      {
        id: 'fe-j-ex-cart',
        title: 'Trace and repair cart arithmetic',
        prompt:
          'Write a cart-total function accepting line items with numeric prices and quantities from text inputs. Return a total or field-specific validation errors. Include worked examples for zero quantity, blank input, fractional quantity, and two valid items.',
        reference:
          'Decide and state the quantity policy before conversion. Distinguish blank input from zero, reject values outside the policy, and perform numeric addition rather than concatenation. Explain currency rounding assumptions.',
        criteria: [
          'The empty string is not silently accepted as a valid quantity.',
          'Zero follows an explicit documented rule.',
          'Fractional quantities are accepted or rejected consistently.',
          'Examples demonstrate numeric totals and useful error locations.',
        ],
      },
    ],
    practical: [
      {
        id: 'fe-j-ex-filter',
        title: 'Implement a local directory filter',
        prompt:
          'Deliver a searchable in-memory people directory with a labeled input, clear control, result count, and no-results state. Add behavior checks for case differences, empty query, clearing, and long names.',
        reference:
          'Keep source records unchanged, derive filtered results from a documented matching rule, and restore all records when clearing. Use text rendering for names and keep the input usable while results change.',
        criteria: [
          'Matching behavior is specified and tested.',
          'Clear restores both input and results.',
          'No-results feedback differs from a missing interface.',
          'Keyboard operation and narrow-width layout are demonstrated.',
        ],
      },
      {
        id: 'fe-j-ex-preference',
        title: 'Save preferences through failure',
        prompt:
          'Deliver a notification-preference form using a controllable fake request. Show idle, pending, success, and failure states. Demonstrate that two rapid activations do not create overlapping saves and a rejection preserves edits.',
        reference:
          'Own submission on the form, enter pending before awaiting, read checkbox.checked, and return to a retryable state after failure. Announce status without removing the user’s interaction context.',
        criteria: [
          'Checkbox values reflect live checked state.',
          'Pending submission is guarded synchronously.',
          'A failed save preserves every editable value.',
          'Tests cover success, rejection, and rapid repeated activation.',
        ],
      },
      {
        id: 'fe-j-ex-gallery',
        title: 'Create a resilient image gallery',
        prompt:
          'Deliver a gallery with a prominent image and at least eight secondary images. Include dimensions, appropriate alternative text, a broken-image state, and a short performance note explaining loading choices.',
        reference:
          'Reserve image space, keep decorative and informative alternatives distinct, load the prominent visible image promptly, and defer offscreen media. Provide useful failure text without changing the whole page layout.',
        criteria: [
          'Images do not push existing content when loaded.',
          'Alternative text is chosen according to image purpose.',
          'A failed image leaves a usable gallery.',
          'The note connects loading choices to initial visible content.',
        ],
      },
    ],
  },
  mid: {
    fundamentals: [
      {
        id: 'fe-m-ex-state',
        title: 'Model a draft and server state',
        prompt:
          'Deliver a state diagram and transition function for an editable profile with loading, local edits, saving, failure, and confirmation. Define how a server refresh interacts with a dirty draft and include example event sequences.',
        reference:
          'Separate canonical data, editable draft, and request identity. Derive dirty status when possible and preserve work on recoverable failure. A background refresh must follow an explicit conflict policy.',
        criteria: [
          'The model distinguishes local edits from confirmed data.',
          'Failure and retry preserve the intended draft.',
          'A stale completion cannot mark newer edits saved.',
          'At least five sequences demonstrate the transition rules.',
        ],
      },
      {
        id: 'fe-m-ex-tabs',
        title: 'Specify and implement keyboard tabs',
        prompt:
          'Deliver a three-tab interface with an explicit automatic or manual activation policy. Document arrow, Home, End, and Tab behavior, plus the relationships among tabs and panels. Include interaction tests.',
        reference:
          'Use tab and panel semantics with a single roving tab stop. Synchronize selection, focusability, and visible panels. Choose manual activation if panel loading would make arrow navigation unexpectedly slow.',
        criteria: [
          'The activation policy is documented and consistent.',
          'The widget has one intended entry point in the Tab sequence.',
          'Names, selection, and panel relationships are correct.',
          'Tests cover arrows, boundary navigation, and panel focus entry.',
        ],
      },
      {
        id: 'fe-m-ex-layout',
        title: 'Diagnose an overflow and stacking bug',
        prompt:
          'Create a minimal reproduction containing a grid, a long unbroken title, and a tooltip trapped below a sibling stacking context. Deliver a repaired version and explain why each CSS change fixes its own root cause.',
        reference:
          'Inspect intrinsic minimum sizes separately from stacking context ancestry. Use bounded tracks or item minimum resets for overflow, then adjust the overlay boundary or stacking hierarchy. Avoid solving both problems with arbitrary large widths or z-index values.',
        criteria: [
          'The reproduction shows both failures independently.',
          'The repaired grid fits its container with long content.',
          'The tooltip has a deliberate overlay/stacking boundary.',
          'The explanation distinguishes layout sizing from paint stacking.',
        ],
      },
    ],
    practical: [
      {
        id: 'fe-m-ex-upload',
        title: 'Build a cancelable file preview flow',
        prompt:
          'Deliver a file preview and upload interface with selection, replacement, cancellation, success, and failure. Use a fake API with controllable completion order. Include object-URL cleanup and a note on server validation.',
        reference:
          'Track each selected file/upload operation by identity. Revoke obsolete preview URLs when safe, distinguish expected aborts from errors, and avoid claiming that client accept filters validate uploaded bytes.',
        criteria: [
          'Replacing a file cannot display an older upload result.',
          'Cancel has an explicit user-visible state.',
          'Obsolete object URLs are released.',
          'Tests cover replacement, abort, rejection, and successful upload.',
        ],
      },
      {
        id: 'fe-m-ex-history',
        title: 'Implement URL-owned catalog navigation',
        prompt:
          'Deliver a catalog prototype with committed category, sort, and page in the URL, plus a separately editable search draft. Demonstrate Back, Forward, reload, filter reset, and a late old response using controlled requests.',
        reference:
          'Define a commit boundary, parse URL values defensively, reset incompatible pagination when filters change, and guard every request-owned state update. Browser navigation must feed the same state model as direct interaction.',
        criteria: [
          'Reload and history restore the committed view.',
          'Uncommitted keystrokes follow the documented history policy.',
          'Filter changes cannot retain an invalid page.',
          'Late results, errors, and finalizers cannot overwrite the active request.',
        ],
      },
      {
        id: 'fe-m-ex-performance',
        title: 'Measure and reduce directory input lag',
        prompt:
          'Deliver a 20,000-record filtering demo, a recorded baseline measurement, and an improved implementation. Compare two runs under the same conditions, and include a correctness test for rapid query changes.',
        reference:
          'Measure whether time is spent filtering, rendering, or layout before choosing a fix. Consider narrower updates, bounded rendering, or worker computation according to evidence. Any asynchronous optimization still needs response ownership.',
        criteria: [
          'The baseline identifies a measured bottleneck.',
          'The implementation addresses that bottleneck specifically.',
          'Before/after measurements use comparable conditions.',
          'Rapid input preserves the newest query’s correct results.',
        ],
      },
    ],
  },
  senior: {
    fundamentals: [
      {
        id: 'fe-s-ex-contract',
        title: 'Design a shared dialog migration contract',
        prompt:
          'Deliver a design note and consumer contract tests for migrating a widely used dialog component. Cover nested overlays, focus restoration, Escape policy, background inertness, scroll locking, and compatibility across old and new consumers.',
        reference:
          'Separate product decisions from reusable modal mechanics. Model overlay ownership and balanced resource acquisition. Pilot representative workflows with explicit observable compatibility tests and a versioned migration path.',
        criteria: [
          'The contract covers focus and interaction, not only props.',
          'Nested overlays retain correct focus and scroll ownership.',
          'Compatibility risks have concrete consumer tests.',
          'The migration includes rollout evidence and a rollback route.',
        ],
      },
      {
        id: 'fe-s-ex-offline',
        title: 'Specify offline edit reconciliation',
        prompt:
          'Deliver a state machine, wire protocol, and test matrix for an offline document editor used concurrently in two tabs. Cover unknown write outcomes, changed server versions, queued commands, and authentication changes.',
        reference:
          'Use stable operation identities and server versions, define a conflict-resolution policy, and distinguish local durability from remote confirmation. Persisted queues must not cross principal boundaries accidentally.',
        criteria: [
          'Unknown outcomes have reconciliation rather than blind retry.',
          'Conflicting edits preserve enough information for resolution.',
          'Queue ownership includes authenticated identity.',
          'The matrix covers reconnect, duplicate delivery, stale completion, and logout.',
        ],
      },
      {
        id: 'fe-s-ex-threat',
        title: 'Review a widget integration boundary',
        prompt:
          'Deliver a threat model and a hardened message receiver for an embedded account widget. Define expected origins, window identity, message schemas, sensitive-field handling, and failure telemetry. Include adversarial message fixtures.',
        reference:
          'Validate both sender context and payload semantics before mutating account state. Keep trust decisions separate from UI presentation, avoid raw payload logging, and specify behavior for unknown or malformed messages.',
        criteria: [
          'Origin and source checks match the embedding contract.',
          'Payload validation constrains accepted operations and values.',
          'Telemetry excludes sensitive account contents.',
          'Tests include wrong origin, wrong source, malformed payload, and valid messages.',
        ],
      },
    ],
    practical: [
      {
        id: 'fe-s-ex-optimistic',
        title: 'Reconcile concurrent optimistic mutations',
        prompt:
          'Deliver a runnable optimistic editor supporting two rapid edits to one record and independent edits to another. Use deterministic fake responses to demonstrate reversed successes, an older failure after newer success, and an ambiguous timeout.',
        reference:
          'Track per-operation identity and the server’s version/ordering contract. Roll back only state still owned by the failed mutation, preserve unrelated updates, and reconcile unknown outcomes with a stable operation key.',
        criteria: [
          'Older failures cannot erase newer confirmed data.',
          'Unrelated records survive scoped rollback.',
          'Unknown outcomes have a defined status/retry contract.',
          'Deterministic tests exercise every requested completion ordering.',
        ],
      },
      {
        id: 'fe-s-ex-release',
        title: 'Plan a safe client asset rollout',
        prompt:
          'Deliver a release simulation and runbook for a client with lazy chunks, persisted cache schema, and service-worker updates. Include an old editing tab surviving a new deployment, a missing chunk, and rollback to the previous release.',
        reference:
          'Retain immutable versioned assets for active clients, version persisted data, and define a draft-safe update transition. Separate recoverable loading errors from incompatible-state failures and provide bounded recovery.',
        criteria: [
          'Old clients can resolve their referenced assets during the compatibility window.',
          'Persisted data is migrated or safely invalidated.',
          'Update and rollback preserve unsaved work by explicit policy.',
          'The simulation demonstrates missing-resource recovery without infinite reloads.',
        ],
      },
      {
        id: 'fe-s-ex-budget',
        title: 'Run an accessibility and latency release gate',
        prompt:
          'Deliver a release evaluation for a large searchable selector using real or reproducible fixture measurements. Include low-end-device interaction latency, keyboard and assistive-technology checks, virtualization focus behavior, and go/no-go criteria.',
        reference:
          'Measure representative journeys and relevant user segments rather than relying on a single aggregate score. Keep active accessible options present under virtualization, compare against a baseline, and define ownership for failed gates and exceptions.',
        criteria: [
          'Latency budgets name the journey, environment, and segment.',
          'Keyboard and accessible-state checks cover a complete selection journey.',
          'Virtualization preserves an existing active-descendant target.',
          'The release decision is supported by evidence and a recovery plan.',
        ],
      },
    ],
  },
};

const specific: Record<Tier, { fundamentals: Entry[]; practical: Entry[] }> = {
  junior: { fundamentals: juniorFundamentals, practical: juniorPractical },
  mid: { fundamentals: midFundamentals, practical: midPractical },
  senior: { fundamentals: seniorFundamentals, practical: seniorPractical },
};

export function frontendBank(tier: Tier): RoleBank {
  return {
    fundamentals: questions([...foundation, ...specific[tier].fundamentals]),
    practical: questions([...practice, ...specific[tier].practical]),
    fundamentalsExercises: exercises[tier].fundamentals,
    practicalExercises: exercises[tier].practical,
  };
}
