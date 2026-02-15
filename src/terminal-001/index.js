/**
 * Terminal emulator for JavaScript
 * - Exports `Terminal` class
 * 
 * @module terminal
 * @author Ben Scarletti
 * @since 2026-01-16
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < =======================================================
// < Class: Terminal
// < =======================================================

/** 
 * Utility class for `<div class="terminal">`
 */
class Terminal {

    /** @type {HTMLElement} */
    parent;

    /** @type {HTMLDivElement} */
    element;

    /** @type {HTMLDivElement} */
    monitor;

    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {HTMLDivElement} */
    gutter;

    /** @type {HTMLDivElement} */
    outputs;

    /** @type {{ [key: string]: () }} */
    commands;

    /**
     * Initialise terminal instance and inject into a parent element
     * 
     * @param {HTMLElement} parent Parent element to inject into
     */
    init(parent) {
        this.parent = parent;
        this._inject(this.parent);
        this.element = this.parent.querySelector('.terminal');
        this.monitor = this.parent.querySelector('.monitor');
        this.textarea = this.parent.querySelector('textarea');
        this.gutter = this.parent.querySelector('.gutter');
        this.outputs = this.parent.querySelector('.outputs');
        this.commands = {};
    }

    /**
     * Inject `<div class="terminal">` into a parent element
     *
     * @param {HTMLElement} parent - Parent element to inject into
     */
    _inject(parent) {
        const markup = `
            <div class="terminal">
                <div class="monitor">
                    <div class="outputs"></div>
                    <div class="inputs">
                        <div class="gutter">$&nbsp;&nbsp;</div>
                        <textarea rows="1"></textarea>
                    </div>
                </div>
            </div>
        `;
        const temp = document.createElement('div');
        temp.innerHTML = markup;
        parent.appendChild(temp.firstElementChild);
    }

    /**
     * Update terminal command dictionary
     * - Merges with current command dictionary
     * 
     * @param {{ [key: string]: () }} commands - Dictionary of commands
     */
    updateCommands(commands) {
        Object.assign(this.commands, commands);
    }

    /**
     * Add a single command to the terminal
     * 
     * @param {string} name - Command name
     * @param {() => void} command - Command function
     */
    addCommand(name, command) {
        this.commands[name] = command;
    }

    /**
     * Add text to the terminal monitor
     * - The text is wrapped in a `<div class='output'>` element
     * 
     * @param {string} text - Text to add to the terminal monitor
     * @param {object} options - General options
     * @param {EchoColour} options.flavour - Class name for styling
     * @param {boolean} options.scrolling - Option to scroll the monitor [true]
     * @param {boolean} options.prefixed - Option to add prompt prefix [false]
     */
    echo(text, { flavour = 'log', scrolling = true, prefixed = false } = {}) {
        if (!text || text.trim() === '') text = '\u00A0';
        const div = document.createElement('div');
        div.className = `output ${flavour}`;
        if (prefixed) text = '$  ' + text;
        div.textContent = text;
        this.outputs.appendChild(div);
        if (scrolling) {
            this.scrollToMonitorBottom();
        }
    }

    /**
     * Scroll to the bottom of the terminal monitor
     */
    scrollToMonitorBottom() {
        this.monitor.scrollTo(0, this.monitor.scrollHeight);
    }

    /** 
     * Get the text from the terminal textarea
     * 
     * @param {boolean} trimming - Option to remove whitespace from the text [false]
     * @param {boolean} lowercase - Option to convert text to lower case [false]
     * @returns {string} The text in the textarea
     */
    getText(trimming = false, lowercase = false) {
        let text = this.textarea.value;
        if (trimming) {
            text = text.trim();
        }
        if (lowercase) {
            text = text.toLowerCase();
        }
        return text;
    }

    /** 
     * Set the text for the terminal textarea
     * 
     * @param {string} text - The text for the textarea
     */
    setText(text) {
        this.textarea.value = text;
    }

    /** 
     * Clear the text for the terminal textarea
     */
    clearText() {
        this.setText('');
        this.autoResizeAll();
    }

    /** 
     * Clear outputs from the terminal monitor
     */
    clearOutputs() {
        this.outputs.innerHTML = '';
    }

    /**
     * Automatically resize terminal textarea based on content
     */
    autoResizeTextarea() {
        this.textarea.style.height = '0px'; // ? Essential reflow
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }

    /**
     * Automatically resize terminal gutter based on textarea size
     */
    autoResizeGutter() {
        const value = this.textarea.value;
        const lines = value === '' ? 1 : value.split('\n').length;
        this.gutter.textContent = '$  \n' + '•  \n'.repeat(lines - 1);
    }

    /**
     * Automatically resize terminal textarea and gutter
     */
    autoResizeAll() {
        this.autoResizeTextarea();
        this.autoResizeGutter();
    }

    /**
     * Focus user input on terminal textarea
     */
    focus() {
        this.textarea.focus();
    }

    /**
     * Process command by name
     * 
     * @param {string} name - Name of the command to process
     * @param {boolean} echoing - Option to echo the command name [true]
     * @param {boolean} clearing - Option to clear terminal textarea [true]
     * @returns {*} - The result of the command, or undefined
     */
    processCommand(name, echoing = true, clearing = true) {
        if (clearing) {
            this.clearText();
        }
        const command = this.commands[name];
        if (command) {
            if (echoing) {
                this.echo(name, { prefixed: true });
            }
            return command();
        }
        this.echo(`No command found: ${name}`);
    }

    /**
     * Toggle visibility of the terminal
     * 
     * @param {boolean} [force] Option to force hidden
     * @returns {boolean} The final state of the 'hidden' class
     */
    toggle(force) {
        return this.element.classList.toggle('hidden', force);
    }

}

// > =======================================================
// > Exports
// > =======================================================

export {
    Terminal
}