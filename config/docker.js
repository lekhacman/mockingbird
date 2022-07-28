const { spawnSync, spawn } = require('child_process');

const commands = createCommands();

const command = process.argv[2];
if (commands.hasOwnProperty(command)) {
  commands[command]();
} else {
  console.log(`Unknown command: ${command}`);
}

function createCommands() {
  const name = process.env.npm_package_name;
  const imageName = `${name}:latest`;
  const port = process.env.npm_package_port;
  console.log(`${name} : http://localhost:${port}`);

  function clean() {
    console.log('Cleanup old image');
    spawnSync('docker', ['stop', name]);
    spawnSync('docker', ['rm', name]);
    spawnSync('docker', ['rmi', imageName]);
  }

  function build() {
    console.log(`Build image:\t${imageName}`);
    spawnSync('docker', ['build', __dirname, '-t', imageName]);
  }

  function run() {
    console.log(`Run image:\t${name} at port ${port}`);
    spawnSync('docker', [
      'run',
      '--name',
      name,
      '-d',
      '-p',
      `${port}:${port}`,
      '--mount',
      `type=bind,src=${process.cwd()},dst=/app`,
      imageName,
    ]);
    console.log(`Container ${name} is starting at http://localhost:${port}`);
  }

  function docker(command) {
    return () => {
      console.log(`${command} : ${spawnSync('docker', [command, name])}`);
    };
  }

  function logs() {
    spawn('docker', ['logs', '-f', name]).stdout.pipe(process.stdout);
  }

  return {
    build: function () {
      clean();
      build();
      run();
    },
    start: docker('start'),
    stop: docker('stop'),
    restart: docker('restart'),
    logs,
    clean,
  };
}
