import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

// --- Virtual Filesystem Initialization ---
const initialFS = {
  '/': { type: 'dir', children: ['home', 'etc', 'usr', 'var', 'tmp', 'bin'] },
  '/bin': { type: 'dir', children: ['ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'rm', 'clear', 'whoami', 'date', 'neofetch', 'help', 'hostname', 'uname'] },
  '/etc': { type: 'dir', children: ['hostname', 'os-release', 'motd'] },
  '/etc/hostname': { type: 'file', content: 'lithium-station\n' },
  '/etc/os-release': { type: 'file', content: 'NAME="Lithium OS"\nVERSION="5.0 (Obsidian Quantum)"\nID=lithium\nPRETTY_NAME="Lithium OS v5.0"\n' },
  '/etc/motd': { type: 'file', content: '\nWelcome to Lithium OS v5.0\n* Type "help" to see available commands.\n* Virtual Node: active\n' },
  '/home': { type: 'dir', children: ['user'] },
  '/home/user': { type: 'dir', children: ['projects', 'notes', 'docs'] },
  '/home/user/notes': { type: 'dir', children: ['welcome.txt'] },
  '/home/user/notes/welcome.txt': { type: 'file', content: 'Welcome to your new spatial workspace.\nEverything here is local-first.\n' },
  '/tmp': { type: 'dir', children: [] },
  '/var': { type: 'dir', children: ['log'] },
  '/usr': { type: 'dir', children: ['bin'] },
};

export default function LinuxTerminal({ playSound }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const shellRef = useRef({
    cwd: '/home/user',
    user: 'root',
    hostname: 'station',
    history: [],
    historyIdx: -1,
    currentLine: '',
    fs: initialFS
  });

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        selection: 'rgba(88, 166, 255, 0.3)',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d2991d',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#ffffff',
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    const prompt = () => {
      const { user, hostname, cwd } = shellRef.current;
      term.write(`\r\x1b[1;32m${user}@${hostname}\x1b[0m:\x1b[1;34m${cwd}\x1b[0m# `);
    };

    term.writeln('\x1b[1;36mLithium OS Kernel v5.0.0-quantum-glass\x1b[0m');
    term.writeln('System initialized. Virtual node established.');
    term.writeln('');
    prompt();

    const handleInput = (data) => {
      const state = shellRef.current;
      
      if (data === '\r') { // Enter
        term.writeln('');
        executeCommand(state.currentLine.trim());
        state.currentLine = '';
        prompt();
      } else if (data === '\u007f') { // Backspace
        if (state.currentLine.length > 0) {
          state.currentLine = state.currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\u001b[A') { // Up Arrow
        // History logic would go here
      } else if (data === '\u001b[B') { // Down Arrow
        // History logic would go here
      } else {
        state.currentLine += data;
        term.write(data);
      }
    };

    term.onData(handleInput);

    const executeCommand = (cmdStr) => {
      if (!cmdStr) return;
      const args = cmdStr.split(/\s+/);
      const cmd = args[0];
      const state = shellRef.current;
      state.history.push(cmdStr);

      if (playSound) playSound('click');

      switch (cmd) {
        case 'help':
          term.writeln('Available commands: ls, cd, pwd, cat, echo, mkdir, rm, clear, whoami, date, neofetch, hostname, uname, exit');
          break;
        case 'ls':
          const dir = state.fs[state.cwd] || state.fs['/'];
          if (dir && dir.type === 'dir') {
            term.writeln(dir.children.join('  '));
          }
          break;
        case 'pwd':
          term.writeln(state.cwd);
          break;
        case 'cd':
          const target = args[1] || '/home/user';
          let newPath = target.startsWith('/') ? target : (state.cwd === '/' ? `/${target}` : `${state.cwd}/${target}`);
          newPath = newPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
          if (state.fs[newPath] && state.fs[newPath].type === 'dir') {
            state.cwd = newPath;
          } else {
            term.writeln(`cd: no such directory: ${target}`);
          }
          break;
        case 'cat':
          const file = args[1];
          const filePath = file?.startsWith('/') ? file : (state.cwd === '/' ? `/${file}` : `${state.cwd}/${file}`);
          const fileObj = state.fs[filePath];
          if (fileObj && fileObj.type === 'file') {
            term.writeln(fileObj.content);
          } else {
            term.writeln(`cat: ${file || ''}: No such file`);
          }
          break;
        case 'clear':
          term.clear();
          break;
        case 'whoami':
          term.writeln(state.user);
          break;
        case 'date':
          term.writeln(new Date().toString());
          break;
        case 'hostname':
          term.writeln(state.hostname);
          break;
        case 'uname':
          term.writeln('Lithium 5.0.0-obsidian Quantum x86_64 WebOS');
          break;
        case 'neofetch':
          term.writeln('   \x1b[36m.o+`          \x1b[0m   \x1b[1;36mroot\x1b[0m@\x1b[1;36mstation\x1b[0m');
          term.writeln('  \x1b[36m`ooo/          \x1b[0m   ------------');
          term.writeln(' \x1b[36m`+oooo:         \x1b[0m   \x1b[1;36mOS\x1b[0m: Lithium OS v5.0');
          term.writeln('\x1b[36m`+oooooo:        \x1b[0m   \x1b[1;36mKernel\x1b[0m: WebQuantum v1.0');
          term.writeln('\x1b[36m-+oooooo+:       \x1b[0m   \x1b[1;36mUptime\x1b[0m: Infinite');
          term.writeln('\x1b[36m Lithium OS 5.0  \x1b[0m   \x1b[1;36mShell\x1b[0m: quantum-sh');
          term.writeln('\x1b[36m Kernel: Quantum \x1b[0m   \x1b[1;36mUI\x1b[0m: Obsidian Glass');
          break;
        default:
          term.writeln(`sh: command not found: ${cmd}`);
      }
    };

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [playSound]);

  return (
    <div 
      className="w-full h-full bg-[#0d1117] relative overflow-hidden flex flex-col"
      style={{ borderRadius: '0 0 14px 14px' }}
    >
      <div 
        ref={terminalRef} 
        className="flex-1 w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-20"></div>
    </div>
  );
}
