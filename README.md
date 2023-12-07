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
