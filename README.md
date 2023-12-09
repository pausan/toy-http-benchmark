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
| uWebSockets.js (text)      | 20.34.0  |    🥉 15.09x |  🥇 126816 |      🥇 1891 |       🥇 10.3MB/s |
| hyper-express (text)       | 6.14.3   |    🥉 11.86x |   🥈 99669 |      🥉 6743 |        🥈 8.1MB/s |
| node:net (text)            | v20.10.0 |        7.98x |   🥉 67105 |      🥈 3560 |           4.6MB/s |
| h3 (text)                  | 1.9.0    |        3.96x |      33252 |        15059 |        🥉 5.1MB/s |
| node:http (text)           | v20.10.0 |        3.79x |      31866 |         6763 |           4.7MB/s |
| fastify (text)             | 4.24.3   |        3.38x |      28447 |        71538 |           4.8MB/s |
| uwebsockets-express (text) | 1.3.5    |        3.27x |      27508 |         9425 |           3.5MB/s |
| express (text)             | 4.18.2   |        1.00x |       8405 |       353977 |           2.0MB/s |

### redis Benchmark

| Name                        | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :-------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (redis)      | 20.34.0  |    🥉 10.81x |   🥇 96065 |      🥇 2360 |        🥇 7.8MB/s |
| hyper-express (redis)       | 6.14.3   |     🥉 9.29x |   🥈 82560 |      🥉 4757 |        🥈 6.7MB/s |
| node:net (redis)            | v20.10.0 |        7.13x |   🥉 63380 |      🥈 3244 |           4.3MB/s |
| node:http (redis)           | v20.10.0 |        3.73x |      33152 |        11597 |           4.9MB/s |
| fastify (redis)             | 4.24.3   |        3.59x |      31861 |         6399 |        🥉 5.4MB/s |
| uwebsockets-express (redis) | 1.3.5    |        3.03x |      26951 |        10234 |           3.5MB/s |
| h3 (redis)                  | 1.9.0    |        2.88x |      25589 |         9158 |           3.9MB/s |
| express (redis)             | 4.18.2   |        1.00x |       8887 |        32229 |           2.1MB/s |

### better-sqlite3 Benchmark

| Name                                 | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (better-sqlite3)      | 20.34.0  |     🥉 6.78x |   🥇 50375 |        13788 |        🥇 4.1MB/s |
| hyper-express (better-sqlite3)       | 6.14.3   |        6.14x |   🥈 45631 |      🥇 8512 |        🥈 3.7MB/s |
| node:net (better-sqlite3)            | v20.10.0 |        4.58x |   🥉 34002 |     🥉 11063 |           2.3MB/s |
| h3 (better-sqlite3)                  | 1.9.0    |        3.14x |      23333 |      🥈 8745 |        🥉 3.6MB/s |
| node:http (better-sqlite3)           | v20.10.0 |        2.79x |      20725 |        22772 |           3.0MB/s |
| fastify (better-sqlite3)             | 4.24.3   |        2.70x |      20071 |        24314 |           3.4MB/s |
| uwebsockets-express (better-sqlite3) | 1.3.5    |        2.60x |      19336 |        15608 |           2.5MB/s |
| express (better-sqlite3)             | 4.18.2   |        1.00x |       7428 |       143581 |           1.7MB/s |

### sqlite3 Benchmark

| Name                          | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :---------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (sqlite3)      | 20.34.0  |     🥉 6.14x |   🥇 41018 |      🥉 8663 |        🥇 3.3MB/s |
| hyper-express (sqlite3)       | 6.14.3   |     🥉 5.66x |   🥈 37774 |      🥇 7260 |        🥈 3.1MB/s |
| node:net (sqlite3)            | v20.10.0 |        4.67x |   🥉 31199 |      🥈 8605 |           2.1MB/s |
| node:http (sqlite3)           | v20.10.0 |        2.70x |      18009 |         9797 |           2.6MB/s |
| h3 (sqlite3)                  | 1.9.0    |        2.67x |      17796 |         8878 |           2.7MB/s |
| uwebsockets-express (sqlite3) | 1.3.5    |        2.63x |      17548 |        13931 |           2.3MB/s |
| fastify (sqlite3)             | 4.24.3   |        2.52x |      16819 |        19068 |        🥉 2.9MB/s |
| express (sqlite3)             | 4.18.2   |        1.00x |       6675 |        23776 |           1.5MB/s |

### pg Benchmark

| Name                     | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (pg)      | 20.34.0  |     🥉 3.83x |   🥇 20246 |     🥈 11119 |           1.6MB/s |
| hyper-express (pg)       | 6.14.3   |     🥉 3.67x |   🥈 19386 |     🥉 12599 |           1.6MB/s |
| node:net (pg)            | v20.10.0 |        3.50x |   🥉 18464 |      🥇 8732 |           1.3MB/s |
| node:http (pg)           | v20.10.0 |        2.52x |      13322 |        12948 |        🥈 2.0MB/s |
| h3 (pg)                  | 1.9.0    |        2.41x |      12717 |        13420 |        🥉 1.9MB/s |
| fastify (pg)             | 4.24.3   |        2.41x |      12708 |        14619 |        🥇 2.2MB/s |
| uwebsockets-express (pg) | 1.3.5    |        2.35x |      12392 |        16545 |           1.6MB/s |
| express (pg)             | 4.18.2   |        1.00x |       5280 |        47823 |           1.2MB/s |

### postgres Benchmark

| Name                           | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| fastify (postgres)             | 4.24.3   |     🥇 2.86x |   🥇 10789 |     🥇 20396 |        🥇 1.8MB/s |
| hyper-express (postgres)       | 6.14.3   |     🥈 2.20x |    🥈 8313 |     🥈 24193 |           0.7MB/s |
| h3 (postgres)                  | 1.9.0    |     🥉 2.15x |    🥉 8112 |     🥉 26094 |        🥉 1.2MB/s |
| express (postgres)             | 4.18.2   |        1.74x |       6587 |        58167 |        🥈 1.5MB/s |
| node:net (postgres)            | v20.10.0 |        1.61x |       6094 |        27656 |           0.4MB/s |
| node:http (postgres)           | v20.10.0 |        1.57x |       5924 |        57147 |           0.9MB/s |
| uWebSockets.js (postgres)      | 20.34.0  |        1.52x |       5724 |        26648 |           0.5MB/s |
| uwebsockets-express (postgres) | 1.3.5    |        1.00x |       3775 |        65051 |           0.5MB/s |

### All Benchmarks

| Name                                 | Version  | Speed Factor | Requests/s | Latency (us) | Throughput (MB/s) |
| :----------------------------------- | :------- | -----------: | ---------: | -----------: | ----------------: |
| uWebSockets.js (text)                | 20.34.0  |    🥇 33.59x |  🥇 126816 |      🥇 1891 |       🥇 10.3MB/s |
| hyper-express (text)                 | 6.14.3   |    🥈 26.40x |   🥈 99669 |         6743 |        🥈 8.1MB/s |
| uWebSockets.js (redis)               | 20.34.0  |    🥉 25.44x |   🥉 96065 |      🥈 2360 |        🥉 7.8MB/s |
| hyper-express (redis)                | 6.14.3   |       21.87x |      82560 |         4757 |           6.7MB/s |
| node:net (text)                      | v20.10.0 |       17.77x |      67105 |         3560 |           4.6MB/s |
| node:net (redis)                     | v20.10.0 |       16.79x |      63380 |      🥉 3244 |           4.3MB/s |
| uWebSockets.js (better-sqlite3)      | 20.34.0  |       13.34x |      50375 |        13788 |           4.1MB/s |
| hyper-express (better-sqlite3)       | 6.14.3   |       12.09x |      45631 |         8512 |           3.7MB/s |
| uWebSockets.js (sqlite3)             | 20.34.0  |       10.86x |      41018 |         8663 |           3.3MB/s |
| hyper-express (sqlite3)              | 6.14.3   |       10.00x |      37774 |         7260 |           3.1MB/s |
| node:net (better-sqlite3)            | v20.10.0 |        9.01x |      34002 |        11063 |           2.3MB/s |
| h3 (text)                            | 1.9.0    |        8.81x |      33252 |        15059 |           5.1MB/s |
| node:http (redis)                    | v20.10.0 |        8.78x |      33152 |        11597 |           4.9MB/s |
| node:http (text)                     | v20.10.0 |        8.44x |      31866 |         6763 |           4.7MB/s |
| fastify (redis)                      | 4.24.3   |        8.44x |      31861 |         6399 |           5.4MB/s |
| node:net (sqlite3)                   | v20.10.0 |        8.26x |      31199 |         8605 |           2.1MB/s |
| fastify (text)                       | 4.24.3   |        7.53x |      28447 |        71538 |           4.8MB/s |
| uwebsockets-express (text)           | 1.3.5    |        7.29x |      27508 |         9425 |           3.5MB/s |
| uwebsockets-express (redis)          | 1.3.5    |        7.14x |      26951 |        10234 |           3.5MB/s |
| h3 (redis)                           | 1.9.0    |        6.78x |      25589 |         9158 |           3.9MB/s |
| h3 (better-sqlite3)                  | 1.9.0    |        6.18x |      23333 |         8745 |           3.6MB/s |
| node:http (better-sqlite3)           | v20.10.0 |        5.49x |      20725 |        22772 |           3.0MB/s |
| uWebSockets.js (pg)                  | 20.34.0  |        5.36x |      20246 |        11119 |           1.6MB/s |
| fastify (better-sqlite3)             | 4.24.3   |        5.32x |      20071 |        24314 |           3.4MB/s |
| hyper-express (pg)                   | 6.14.3   |        5.13x |      19386 |        12599 |           1.6MB/s |
| uwebsockets-express (better-sqlite3) | 1.3.5    |        5.12x |      19336 |        15608 |           2.5MB/s |
| node:net (pg)                        | v20.10.0 |        4.89x |      18464 |         8732 |           1.3MB/s |
| node:http (sqlite3)                  | v20.10.0 |        4.77x |      18009 |         9797 |           2.6MB/s |
| h3 (sqlite3)                         | 1.9.0    |        4.71x |      17796 |         8878 |           2.7MB/s |
| uwebsockets-express (sqlite3)        | 1.3.5    |        4.65x |      17548 |        13931 |           2.3MB/s |
| fastify (sqlite3)                    | 4.24.3   |        4.45x |      16819 |        19068 |           2.9MB/s |
| node:http (pg)                       | v20.10.0 |        3.53x |      13322 |        12948 |           2.0MB/s |
| h3 (pg)                              | 1.9.0    |        3.37x |      12717 |        13420 |           1.9MB/s |
| fastify (pg)                         | 4.24.3   |        3.37x |      12708 |        14619 |           2.2MB/s |
| uwebsockets-express (pg)             | 1.3.5    |        3.28x |      12392 |        16545 |           1.6MB/s |
| fastify (postgres)                   | 4.24.3   |        2.86x |      10789 |        20396 |           1.8MB/s |
| express (redis)                      | 4.18.2   |        2.35x |       8887 |        32229 |           2.1MB/s |
| express (text)                       | 4.18.2   |        2.23x |       8405 |       353977 |           2.0MB/s |
| hyper-express (postgres)             | 6.14.3   |        2.20x |       8313 |        24193 |           0.7MB/s |
| h3 (postgres)                        | 1.9.0    |        2.15x |       8112 |        26094 |           1.2MB/s |
| express (better-sqlite3)             | 4.18.2   |        1.97x |       7428 |       143581 |           1.7MB/s |
| express (sqlite3)                    | 4.18.2   |        1.77x |       6675 |        23776 |           1.5MB/s |
| express (postgres)                   | 4.18.2   |        1.74x |       6587 |        58167 |           1.5MB/s |
| node:net (postgres)                  | v20.10.0 |        1.61x |       6094 |        27656 |           0.4MB/s |
| node:http (postgres)                 | v20.10.0 |        1.57x |       5924 |        57147 |           0.9MB/s |
| uWebSockets.js (postgres)            | 20.34.0  |        1.52x |       5724 |        26648 |           0.5MB/s |
| express (pg)                         | 4.18.2   |        1.40x |       5280 |        47823 |           1.2MB/s |
| uwebsockets-express (postgres)       | 1.3.5    |        1.00x |       3775 |        65051 |           0.5MB/s |


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
