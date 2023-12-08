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

### text Benchmark

| Name                       | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (text)      | 20.34.0  |    🥉 15.01x |  🥇 126570 |      🥇 1757 |       🥇 10.3MB/s |
| hyper-express (text)       | 6.14.3   |    🥉 13.74x |  🥈 115843 |      🥈 2536 |        🥈 9.4MB/s |
| node:net (text)            | v20.10.0 |        7.58x |   🥉 63902 |      🥉 4661 |           4.3MB/s |
| h3 (text)                  | 1.9.0    |        4.37x |      36862 |        13829 |        🥉 5.6MB/s |
| node:http (text)           | v20.10.0 |        3.71x |      31280 |         6416 |           4.6MB/s |
| fastify (text)             | 4.24.3   |        3.49x |      29413 |        70842 |           5.0MB/s |
| uwebsockets-express (text) | 1.3.5    |        3.13x |      26400 |        12603 |           3.4MB/s |
| express (text)             | 4.18.2   |        1.00x |       8430 |       360050 |           2.0MB/s |

### sqlite3 Benchmark

| Name                          | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :---------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (sqlite3)      | 20.34.0  |     🥉 6.04x |   🥇 40411 |      🥇 8510 |        🥇 3.3MB/s |
| hyper-express (sqlite3)       | 6.14.3   |     🥉 5.51x |   🥈 36875 |        10287 |        🥈 3.0MB/s |
| node:net (sqlite3)            | v20.10.0 |     🥉 4.63x |   🥉 30986 |      🥈 8601 |           2.1MB/s |
| node:http (sqlite3)           | v20.10.0 |        2.76x |      18495 |      🥉 9790 |           2.7MB/s |
| h3 (sqlite3)                  | 1.9.0    |        2.74x |      18304 |        14978 |           2.8MB/s |
| uwebsockets-express (sqlite3) | 1.3.5    |        2.62x |      17512 |        13380 |           2.3MB/s |
| fastify (sqlite3)             | 4.24.3   |        2.46x |      16486 |        18263 |        🥉 2.8MB/s |
| express (sqlite3)             | 4.18.2   |        1.00x |       6689 |        50388 |           1.6MB/s |

### better-sqlite3 Benchmark

| Name                                 | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (better-sqlite3)      | 20.34.0  |     🥉 6.73x |   🥇 48935 |        15277 |        🥇 4.0MB/s |
| hyper-express (better-sqlite3)       | 6.14.3   |     🥉 6.34x |   🥈 46119 |      🥇 8226 |        🥈 3.7MB/s |
| node:net (better-sqlite3)            | v20.10.0 |        4.59x |   🥉 33389 |     🥈 10797 |           2.3MB/s |
| h3 (better-sqlite3)                  | 1.9.0    |        3.15x |      22930 |        15645 |        🥉 3.5MB/s |
| node:http (better-sqlite3)           | v20.10.0 |        2.87x |      20858 |        14192 |           3.1MB/s |
| uwebsockets-express (better-sqlite3) | 1.3.5    |        2.67x |      19418 |     🥉 13199 |           2.5MB/s |
| fastify (better-sqlite3)             | 4.24.3   |        2.66x |      19332 |        27549 |           3.3MB/s |
| express (better-sqlite3)             | 4.18.2   |        1.00x |       7269 |       132325 |           1.7MB/s |

### pg Benchmark

| Name                     | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (pg)      | 20.34.0  |     🥉 3.75x |   🥇 19875 |        16176 |           1.6MB/s |
| hyper-express (pg)       | 6.14.3   |     🥉 3.59x |   🥈 19047 |        17640 |           1.5MB/s |
| node:net (pg)            | v20.10.0 |     🥉 3.45x |   🥉 18326 |      🥇 8595 |           1.2MB/s |
| node:http (pg)           | v20.10.0 |        2.58x |      13696 |      🥈 9787 |        🥈 2.0MB/s |
| h3 (pg)                  | 1.9.0    |        2.44x |      12924 |        11330 |        🥉 2.0MB/s |
| fastify (pg)             | 4.24.3   |        2.41x |      12796 |     🥉 10880 |        🥇 2.2MB/s |
| uwebsockets-express (pg) | 1.3.5    |        2.28x |      12123 |        15687 |           1.6MB/s |
| express (pg)             | 4.18.2   |        1.00x |       5306 |        55945 |           1.2MB/s |

### postgres Benchmark

| Name                           | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| fastify (postgres)             | 4.24.3   |     🥇 2.68x |   🥇 10773 |     🥇 18369 |        🥇 1.8MB/s |
| hyper-express (postgres)       | 6.14.3   |     🥈 2.06x |    🥈 8280 |     🥈 23147 |           0.7MB/s |
| h3 (postgres)                  | 1.9.0    |     🥉 2.02x |    🥉 8124 |     🥉 30350 |        🥉 1.2MB/s |
| express (postgres)             | 4.18.2   |        1.62x |       6506 |        61387 |        🥈 1.5MB/s |
| node:net (postgres)            | v20.10.0 |        1.47x |       5889 |        36418 |           0.4MB/s |
| node:http (postgres)           | v20.10.0 |        1.42x |       5701 |        32438 |           0.8MB/s |
| uWebSockets.js (postgres)      | 20.34.0  |        1.37x |       5516 |        31355 |           0.4MB/s |
| uwebsockets-express (postgres) | 1.3.5    |        1.00x |       4019 |        50172 |           0.5MB/s |

### All Benchmarks

| Name                                 | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (text)                | 20.34.0  |    🥇 31.49x |  🥇 126570 |      🥇 1757 |       🥇 10.3MB/s |
| hyper-express (text)                 | 6.14.3   |    🥈 28.82x |  🥈 115843 |      🥈 2536 |        🥈 9.4MB/s |
| node:net (text)                      | v20.10.0 |    🥉 15.90x |   🥉 63902 |      🥉 4661 |           4.3MB/s |
| uWebSockets.js (better-sqlite3)      | 20.34.0  |       12.17x |      48935 |        15277 |           4.0MB/s |
| hyper-express (better-sqlite3)       | 6.14.3   |       11.47x |      46119 |         8226 |           3.7MB/s |
| uWebSockets.js (sqlite3)             | 20.34.0  |       10.05x |      40411 |         8510 |           3.3MB/s |
| hyper-express (sqlite3)              | 6.14.3   |        9.17x |      36875 |        10287 |           3.0MB/s |
| h3 (text)                            | 1.9.0    |        9.17x |      36862 |        13829 |        🥉 5.6MB/s |
| node:net (better-sqlite3)            | v20.10.0 |        8.31x |      33389 |        10797 |           2.3MB/s |
| node:http (text)                     | v20.10.0 |        7.78x |      31280 |         6416 |           4.6MB/s |
| node:net (sqlite3)                   | v20.10.0 |        7.71x |      30986 |         8601 |           2.1MB/s |
| fastify (text)                       | 4.24.3   |        7.32x |      29413 |        70842 |           5.0MB/s |
| uwebsockets-express (text)           | 1.3.5    |        6.57x |      26400 |        12603 |           3.4MB/s |
| h3 (better-sqlite3)                  | 1.9.0    |        5.70x |      22930 |        15645 |           3.5MB/s |
| node:http (better-sqlite3)           | v20.10.0 |        5.19x |      20858 |        14192 |           3.1MB/s |
| uWebSockets.js (pg)                  | 20.34.0  |        4.94x |      19875 |        16176 |           1.6MB/s |
| uwebsockets-express (better-sqlite3) | 1.3.5    |        4.83x |      19418 |        13199 |           2.5MB/s |
| fastify (better-sqlite3)             | 4.24.3   |        4.81x |      19332 |        27549 |           3.3MB/s |
| hyper-express (pg)                   | 6.14.3   |        4.74x |      19047 |        17640 |           1.5MB/s |
| node:http (sqlite3)                  | v20.10.0 |        4.60x |      18495 |         9790 |           2.7MB/s |
| node:net (pg)                        | v20.10.0 |        4.56x |      18326 |         8595 |           1.2MB/s |
| h3 (sqlite3)                         | 1.9.0    |        4.55x |      18304 |        14978 |           2.8MB/s |
| uwebsockets-express (sqlite3)        | 1.3.5    |        4.36x |      17512 |        13380 |           2.3MB/s |
| fastify (sqlite3)                    | 4.24.3   |        4.10x |      16486 |        18263 |           2.8MB/s |
| node:http (pg)                       | v20.10.0 |        3.41x |      13696 |         9787 |           2.0MB/s |
| h3 (pg)                              | 1.9.0    |        3.22x |      12924 |        11330 |           2.0MB/s |
| fastify (pg)                         | 4.24.3   |        3.18x |      12796 |        10880 |           2.2MB/s |
| uwebsockets-express (pg)             | 1.3.5    |        3.02x |      12123 |        15687 |           1.6MB/s |
| fastify (postgres)                   | 4.24.3   |        2.68x |      10773 |        18369 |           1.8MB/s |
| express (text)                       | 4.18.2   |        2.10x |       8430 |       360050 |           2.0MB/s |
| hyper-express (postgres)             | 6.14.3   |        2.06x |       8280 |        23147 |           0.7MB/s |
| h3 (postgres)                        | 1.9.0    |        2.02x |       8124 |        30350 |           1.2MB/s |
| express (better-sqlite3)             | 4.18.2   |        1.81x |       7269 |       132325 |           1.7MB/s |
| express (sqlite3)                    | 4.18.2   |        1.66x |       6689 |        50388 |           1.6MB/s |
| express (postgres)                   | 4.18.2   |        1.62x |       6506 |        61387 |           1.5MB/s |
| node:net (postgres)                  | v20.10.0 |        1.47x |       5889 |        36418 |           0.4MB/s |
| node:http (postgres)                 | v20.10.0 |        1.42x |       5701 |        32438 |           0.8MB/s |
| uWebSockets.js (postgres)            | 20.34.0  |        1.37x |       5516 |        31355 |           0.4MB/s |
| express (pg)                         | 4.18.2   |        1.32x |       5306 |        55945 |           1.2MB/s |
| uwebsockets-express (postgres)       | 1.3.5    |        1.00x |       4019 |        50172 |           0.5MB/s |


### Originial Benchmark

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
