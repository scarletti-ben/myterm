// < =======================================================
// < Imports
// < =======================================================

import {
    Terminal
} from 'https://scarletti-ben.github.io/myterm/src/terminal-001/index.js';

// < =======================================================
// < Declarations
// < =======================================================

/** Global `Terminal` instance */
const terminal = new Terminal();

// < =======================================================
// < Queries
// < =======================================================

/** 
 * Lookup of elements queried from the DOM
 */
const queries = {

    /** @type {HTMLDivElement} */
    page: document.getElementById('page'),

    /** @type {HTMLDivElement} */
    content: document.getElementById('content')

}

// < =======================================================
// < Functions
// < =======================================================



// ~ =======================================================
// ~ Execution
// ~ =======================================================

// ? Run callback when all resources have loaded
window.addEventListener('load', () => {

    // Initialise the terminal instance
    terminal.init(queries.content);

    // < ========================
    // < Terminal Commands
    // < ========================

    // Update terminal commands
    terminal.updateCommands({

        help: () => {

            terminal.echo('Showing command list:');
            Object.keys(terminal.commands).forEach(name => {
                terminal.echo(`    ${name}`, { flavour: 'info' });
            });
            terminal.echo();

            terminal.echo('Showing hotkey list:');
            ['Control + /'].forEach(name => {
                terminal.echo(`    ${name}`, { flavour: 'warn' });
            });
            terminal.echo();

        },

        clear: () => {
            terminal.clearOutputs();
        }

    });

    // < ========================
    // < Terminal Listeners
    // < ========================

    // Add input listener to the terminal textarea
    // ~ Key: Any
    // > Action: Resize textarea and gutter
    terminal.textarea.addEventListener('input', () => {
        terminal.autoResizeAll();
        terminal.scrollToMonitorBottom();
    });

    // Add keydown listener to the terminal textarea
    terminal.textarea.addEventListener('keydown', async (event) => {

        // ~ Hotkey: Enter
        // > Action: Handle commands
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const command = terminal.getText();
            if (command === '') return;
            const result = terminal.processCommand(command);
            if (result !== undefined) {
                terminal.echo(`Result: ${result}`);
            }
        }

        // ~ Hotkey: Escape
        // > Action: Clear text
        else if (event.key === 'Escape') {
            terminal.clearText();
        }

    });

    // < ========================
    // < Document Listeners
    // < ========================

    // Add keydown listener to the DOM
    document.addEventListener('keydown', (event) => {

        // ~ Hotkey: Control + /
        // > Action: Toggle terminal visibility
        if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            const hidden = terminal.toggle();
            if (!hidden) {
                terminal.focus();
            }
        };

    });

    // < =========================
    // < Miscellaneous
    // < =========================

    // Call help command
    terminal.processCommand('help', false);

    // Focus user input on the terminal textarea
    terminal.focus();

    // Show the page element
    queries.page.style.display = '';

});