# Toy http benchmark

Simple HTTP/HTTPS benchmark of different HTTP/HTTPS frameworks

All programs have these routes defined in this order:

```
/hey -> "Hey!"
/hell -> "Hell!"
/hello -> "Hello World!"
/about -> "<html><body>About page</body></html>"
/\* -> otherwise 404 with "Not Found"
```

The reason to have several paths starting with the same prefix is to somehow
test a little bit the performance of the routing of the different libraries.

## Benchmark

Initially I used autocannon which is in node and allowed me to easily gather
data as js object, but it was launched in the same process and consuming a lot
of computing, so I decided to do it better and use `wrk` with a script to
easily parse JSON output.

A better testing methodology would require running the server and the
performance load in different machines, running the server & load tool with
different threads, etc... but this will do the trick.

Run with this command:

```bash
$ node bench-all.js
```

```
Configuration:
  Node Version:  v20.10.0
  CPU Model:     Intel(R) Core(TM) i7-8565U CPU @ 1.80GHz
  Path:          /hello
  Duration:      10 s
  Connections:   100
```

### Text Benchmarks

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |        15.57 |  🥇 137829 |  🥇 1372.000 |       🥇 11.2MB/s |
| hyper-express       | 6.14.3   |        0 |        13.57 |  🥈 120114 |  🥈 1639.000 |        🥈 9.7MB/s |
| node:net            | v20.10.0 |        0 |         7.69 |   🥉 68084 |  🥉 2942.000 |           4.6MB/s |
| h3                  | 1.9.0    |        0 |         4.17 |      36872 |    31968.000 |        🥉 5.6MB/s |
| node:http           | v20.10.0 |        0 |         3.69 |      32636 |     6866.000 |           4.8MB/s |
| fastify             | 4.24.3   |        0 |         3.43 |      30363 |    65503.000 |           5.2MB/s |
| uwebsockets-express | 1.3.5    |        0 |         3.08 |      27301 |     9298.000 |           3.5MB/s |
| express             | 4.18.2   |        0 |         1.00 |       8850 |   615370.000 |           2.1MB/s |

### sqlite3 Benchmarks

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |         5.97 |   🥇 41821 |  🥉 7789.000 |        🥇 3.4MB/s |
| hyper-express       | 6.14.3   |        0 |         5.38 |   🥈 37692 |  🥈 7524.000 |        🥈 3.1MB/s |
| node:net            | v20.10.0 |        0 |         4.64 |   🥉 32511 |  🥇 7250.000 |           2.2MB/s |
| node:http           | v20.10.0 |        0 |         2.75 |      19249 |    17584.000 |           2.8MB/s |
| h3                  | 1.9.0    |        0 |         2.63 |      18456 |     8663.000 |           2.8MB/s |
| uwebsockets-express | 1.3.5    |        0 |         2.54 |      17823 |    11195.000 |           2.3MB/s |
| fastify             | 4.24.3   |        0 |         2.41 |      16900 |    17285.000 |        🥉 2.9MB/s |
| express             | 4.18.2   |        0 |         1.00 |       7008 |    44166.000 |           1.6MB/s |

### better-sqlite3 Benchmarks

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |         6.44 |   🥇 49989 |    13488.000 |        🥇 4.0MB/s |
| hyper-express       | 6.14.3   |        0 |         5.79 |   🥈 44950 |  🥈 7653.000 |        🥉 3.6MB/s |
| node:net            | v20.10.0 |        0 |         4.46 |   🥉 34614 |    10367.000 |           2.4MB/s |
| h3                  | 1.9.0    |        0 |         3.18 |      24654 |  🥇 7603.000 |        🥈 3.8MB/s |
| node:http           | v20.10.0 |        0 |         2.81 |      21805 |  🥉 8642.000 |           3.2MB/s |
| fastify             | 4.24.3   |        0 |         2.66 |      20669 |    20295.000 |           3.5MB/s |
| uwebsockets-express | 1.3.5    |        0 |         2.57 |      19977 |    13735.000 |           2.6MB/s |
| express             | 4.18.2   |        0 |         1.00 |       7759 |    24581.000 |           1.8MB/s |

### Original benchmark

This is close to the maximum performance that any of these libraries can achieve
since the responses don't execute any controller handlers or anything, they
just return a string.

Think something in the line of `res.end('text')` instead of `res.end(handler())`

Refer to this commit: a6c78c12a85077fd99bf3c06e8a74ae133158a12 in case you want
to reproduce this result.

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |       18.02x |  🥇 165935 |  🥇 1094.000 |       🥇 13.4MB/s |
| hyper-express       | 6.14.3   |        0 |       14.69x |  🥈 135338 |  🥉 3187.000 |       🥈 11.0MB/s |
| node:net            | v20.10.0 |        0 |        7.85x |   🥉 72271 |  🥈 2861.000 |           4.9MB/s |
| h3                  | 1.9.0    |        0 |        4.04x |      37201 |     9920.000 |        🥉 5.7MB/s |
| node:http           | v20.10.0 |        0 |        3.74x |      34424 |    13758.000 |           5.1MB/s |
| fastify             | 4.24.3   |        0 |        3.52x |      32445 |    68422.000 |           5.5MB/s |
| uwebsockets-express | 1.3.5    |        0 |        3.14x |      28924 |     9779.000 |           3.7MB/s |
| express             | 4.18.2   |        0 |        1.00x |       9210 |   519425.000 |           2.1MB/s |

## Manual benchmark with wrk

You can launch all servers in parallel by executing:

```bash
$ node run-all.js
```

And then, for each port opened in the previous command, you can manually run
something like this:

```bash
wrk --timeout 5s -t 1 -c 100 -d 3s http://localhost:3000/hello
```
