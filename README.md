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

### Plain Text Benchmark

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |       15.64x |  🥇 132755 |      🥇 2131 |       🥇 10.8MB/s |
| hyper-express       | 6.14.3   |        0 |       12.93x |  🥈 109769 |      🥈 2666 |        🥈 8.9MB/s |
| node:net            | v20.10.0 |        0 |        6.98x |   🥉 59267 |      🥉 5099 |           4.0MB/s |
| h3                  | 1.9.0    |        0 |        3.72x |      31557 |        17590 |           4.8MB/s |
| fastify             | 4.24.3   |        0 |        3.42x |      28987 |        58021 |        🥉 4.9MB/s |
| node:http           | v20.10.0 |        0 |        3.41x |      28957 |         9892 |           4.3MB/s |
| uwebsockets-express | 1.3.5    |        0 |        3.10x |      26297 |        11781 |           3.4MB/s |
| express             | 4.18.2   |        0 |        1.00x |       8486 |       594846 |           2.0MB/s |

### sqlite3 Benchmark

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |        6.09x |   🥇 39451 |      🥇 9071 |        🥇 3.2MB/s |
| hyper-express       | 6.14.3   |        0 |        5.17x |   🥈 33509 |     🥈 10536 |           2.7MB/s |
| node:net            | v20.10.0 |        0 |        4.61x |   🥉 29918 |        14907 |           2.0MB/s |
| h3                  | 1.9.0    |        0 |        2.81x |      18229 |        20919 |        🥈 2.8MB/s |
| node:http           | v20.10.0 |        0 |        2.67x |      17302 |     🥉 12425 |           2.5MB/s |
| fastify             | 4.24.3   |        0 |        2.49x |      16148 |        19292 |        🥉 2.7MB/s |
| uwebsockets-express | 1.3.5    |        0 |        2.46x |      15925 |        12490 |           2.1MB/s |
| express             | 4.18.2   |        0 |        1.00x |       6482 |        54246 |           1.5MB/s |

### better-sqlite3 Benchmark

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |        6.67x |   🥇 48163 |        13970 |        🥇 3.9MB/s |
| hyper-express       | 6.14.3   |        0 |        6.04x |   🥈 43616 |      🥇 9742 |        🥈 3.5MB/s |
| node:net            | v20.10.0 |        0 |        4.80x |   🥉 34658 |     🥈 11475 |           2.4MB/s |
| h3                  | 1.9.0    |        0 |        3.08x |      22198 |        29834 |        🥉 3.4MB/s |
| node:http           | v20.10.0 |        0 |        2.88x |      20807 |        21040 |           3.1MB/s |
| uwebsockets-express | 1.3.5    |        0 |        2.72x |      19632 |     🥉 12602 |           2.5MB/s |
| fastify             | 4.24.3   |        0 |        2.50x |      18050 |        18860 |           3.1MB/s |
| express             | 4.18.2   |        0 |        1.00x |       7217 |       167008 |           1.7MB/s |

### pg Benchmark

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0  |        0 |        3.82x |   🥇 20275 |      🥈 8831 |           1.6MB/s |
| hyper-express       | 6.14.3   |        0 |        3.57x |   🥈 18979 |     🥉 10075 |           1.5MB/s |
| node:net            | v20.10.0 |        0 |        3.50x |   🥉 18580 |      🥇 7775 |           1.3MB/s |
| node:http           | v20.10.0 |        0 |        2.53x |      13424 |        10908 |        🥈 2.0MB/s |
| fastify             | 4.24.3   |        0 |        2.41x |      12795 |        18839 |        🥇 2.2MB/s |
| uwebsockets-express | 1.3.5    |        0 |        2.26x |      12015 |        20580 |           1.5MB/s |
| h3                  | 1.9.0    |        0 |        2.23x |      11851 |        19783 |        🥉 1.8MB/s |
| express             | 4.18.2   |        0 |        1.00x |       5313 |        48518 |           1.2MB/s |

### postgres Benchmark

| Name                | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :------------------ | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| fastify             | 4.24.3   |        0 |        2.44x |   🥇 10595 |     🥉 28510 |        🥇 1.8MB/s |
| hyper-express       | 6.14.3   |        0 |        1.98x |    🥈 8614 |     🥇 19785 |           0.7MB/s |
| h3                  | 1.9.0    |        0 |        1.91x |    🥉 8289 |        36571 |        🥉 1.3MB/s |
| express             | 4.18.2   |        0 |        1.53x |       6625 |        62365 |        🥈 1.5MB/s |
| node:net            | v20.10.0 |        0 |        1.40x |       6072 |        31817 |           0.4MB/s |
| node:http           | v20.10.0 |        0 |        1.30x |       5660 |        40800 |           0.8MB/s |
| uWebSockets.js      | 20.34.0  |        0 |        1.30x |       5639 |     🥈 27751 |           0.5MB/s |
| uwebsockets-express | 1.3.5    |        0 |        1.00x |       4344 |        37528 |           0.6MB/s |

### All Benchmarks

| Name                                 | Version  | # Errors | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------------- | :------- | -------: | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (text)                | 20.34.0  |        0 |       30.56x |  🥇 132755 |      🥇 2131 |       🥇 10.8MB/s |
| hyper-express (text)                 | 6.14.3   |        0 |       25.26x |  🥈 109769 |      🥈 2666 |        🥈 8.9MB/s |
| node:net (text)                      | v20.10.0 |        0 |       13.64x |   🥉 59267 |      🥉 5099 |           4.0MB/s |
| uWebSockets.js (better-sqlite3)      | 20.34.0  |        0 |       11.09x |      48163 |        13970 |           3.9MB/s |
| hyper-express (better-sqlite3)       | 6.14.3   |        0 |       10.04x |      43616 |         9742 |           3.5MB/s |
| uWebSockets.js (sqlite3)             | 20.34.0  |        0 |        9.08x |      39451 |         9071 |           3.2MB/s |
| node:net (better-sqlite3)            | v20.10.0 |        0 |        7.98x |      34658 |        11475 |           2.4MB/s |
| hyper-express (sqlite3)              | 6.14.3   |        0 |        7.71x |      33509 |        10536 |           2.7MB/s |
| h3 (text)                            | 1.9.0    |        0 |        7.26x |      31557 |        17590 |           4.8MB/s |
| node:net (sqlite3)                   | v20.10.0 |        0 |        6.89x |      29918 |        14907 |           2.0MB/s |
| fastify (text)                       | 4.24.3   |        0 |        6.67x |      28987 |        58021 |        🥉 4.9MB/s |
| node:http (text)                     | v20.10.0 |        0 |        6.66x |      28957 |         9892 |           4.3MB/s |
| uwebsockets-express (text)           | 1.3.5    |        0 |        6.05x |      26297 |        11781 |           3.4MB/s |
| h3 (better-sqlite3)                  | 1.9.0    |        0 |        5.11x |      22198 |        29834 |           3.4MB/s |
| node:http (better-sqlite3)           | v20.10.0 |        0 |        4.79x |      20807 |        21040 |           3.1MB/s |
| uWebSockets.js (pg)                  | 20.34.0  |        0 |        4.67x |      20275 |         8831 |           1.6MB/s |
| uwebsockets-express (better-sqlite3) | 1.3.5    |        0 |        4.52x |      19632 |        12602 |           2.5MB/s |
| hyper-express (pg)                   | 6.14.3   |        0 |        4.37x |      18979 |        10075 |           1.5MB/s |
| node:net (pg)                        | v20.10.0 |        0 |        4.28x |      18580 |         7775 |           1.3MB/s |
| h3 (sqlite3)                         | 1.9.0    |        0 |        4.20x |      18229 |        20919 |           2.8MB/s |
| fastify (better-sqlite3)             | 4.24.3   |        0 |        4.15x |      18050 |        18860 |           3.1MB/s |
| node:http (sqlite3)                  | v20.10.0 |        0 |        3.98x |      17302 |        12425 |           2.5MB/s |
| fastify (sqlite3)                    | 4.24.3   |        0 |        3.72x |      16148 |        19292 |           2.7MB/s |
| uwebsockets-express (sqlite3)        | 1.3.5    |        0 |        3.67x |      15925 |        12490 |           2.1MB/s |
| node:http (pg)                       | v20.10.0 |        0 |        3.09x |      13424 |        10908 |           2.0MB/s |
| fastify (pg)                         | 4.24.3   |        0 |        2.94x |      12795 |        18839 |           2.2MB/s |
| uwebsockets-express (pg)             | 1.3.5    |        0 |        2.77x |      12015 |        20580 |           1.5MB/s |
| h3 (pg)                              | 1.9.0    |        0 |        2.73x |      11851 |        19783 |           1.8MB/s |
| fastify (postgres)                   | 4.24.3   |        0 |        2.44x |      10595 |        28510 |           1.8MB/s |
| hyper-express (postgres)             | 6.14.3   |        0 |        1.98x |       8614 |        19785 |           0.7MB/s |
| express (text)                       | 4.18.2   |        0 |        1.95x |       8486 |       594846 |           2.0MB/s |
| h3 (postgres)                        | 1.9.0    |        0 |        1.91x |       8289 |        36571 |           1.3MB/s |
| express (better-sqlite3)             | 4.18.2   |        0 |        1.66x |       7217 |       167008 |           1.7MB/s |
| express (postgres)                   | 4.18.2   |        0 |        1.53x |       6625 |        62365 |           1.5MB/s |
| express (sqlite3)                    | 4.18.2   |        0 |        1.49x |       6482 |        54246 |           1.5MB/s |
| node:net (postgres)                  | v20.10.0 |        0 |        1.40x |       6072 |        31817 |           0.4MB/s |
| node:http (postgres)                 | v20.10.0 |        0 |        1.30x |       5660 |        40800 |           0.8MB/s |
| uWebSockets.js (postgres)            | 20.34.0  |        0 |        1.30x |       5639 |        27751 |           0.5MB/s |
| express (pg)                         | 4.18.2   |        0 |        1.22x |       5313 |        48518 |           1.2MB/s |
| uwebsockets-express (postgres)       | 1.3.5    |        0 |        1.00x |       4344 |        37528 |           0.6MB/s |

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
