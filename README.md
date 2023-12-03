# Nodejs http/https benchmark

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

While testing methodology in this library is kind of crap, it is still valuable
in order to get a sense of the performance of all these javascript libraries.

It uses only one process to serve HTTP requests and do the performance load.
Again, far from ideal, BUT consider that all servers are tested using the same
methodology, so while real performance would definitely be better than this, it
still serves to get a general idea and the order of magnitude they operate on.

A better testing methodology would require running the server and the
performance load in different machines and using a better tool such as
wrk/wrk2/bombardier with some warmup.

Anyway, this has been tested using this command:

```bash
$ node test.js
```

```
Configuration:
  Node Version:  v20.10.0
  CPU Model:     Intel(R) Core(TM) i7-8565U CPU @ 1.80GHz
  Path:          /hello
  Requests:      100000
  Connections:   1000
```

| Name                | Version | Duration (s) | # Errors | Latency (us) |   Requests/s | Throughput (KB/s) |
| :------------------ | :------ | -----------: | -------: | -----------: | -----------: | ----------------: |
| uWebSockets.js      | 20.34.0 |     🥇 4.150 |        0 |  🥈 1157.000 | 🥇 27551.000 |       🥇 2424.831 |
| hyper-express       | 6.14.3  |     🥈 5.140 |        0 |  🥇 1154.000 | 🥈 23663.000 |       🥈 2154.495 |
| uwebsockets-express | 1.3.5   |     🥉 8.210 |        0 |  🥉 1200.000 | 🥉 13695.000 |          1861.631 |
| fastify             | 4.24.3  |        9.150 |        0 |     6982.000 |    12007.000 |       🥉 2125.823 |
| express             | 4.18.2  |       23.300 |      896 |     8938.000 |     4703.000 |          1123.327 |

## Manual benchmark with wrk

I did run a manual benchmark by launching all servers at once in different ports:

```bash
$ node run-all.js
```

And then, for each port opened in the previous command, run:

```bash
wrk --timeout 5s -t 1 -c 100 -d 3s http://localhost:3000/hello
```

And here is the result:

| Name                | Version | Speed Ranking | Latency (us) | Requests/s | Throughput/s |
| :------------------ | :------ | ------------: | -----------: | ---------: | -----------: |
| uWebSockets.js      | 20.34.0 |        20.73x |       🥇 830 | 🥇 118.63k | 🥇 9.81 MB/s |
| hyper-express       | 6.14.3  |        13.99x |      🥈 1280 |  🥈 80.06k | 🥈 6.81 MB/s |
| uwebsockets-express | 1.3.5   |         3.57x |      🥉 4930 |  🥉 20.45k |    2.62 MB/s |
| fastify             | 4.24.3  |         3.53x |         5260 |     20.20k | 🥉 3.34 MB/s |
| express             | 4.18.2  |         1.00x |        20860 |      5.72k |    1.38 MB/s |

This is probably closer to the truth, which is still aligned with previous
results although here it can be observed better performance on the first two
libraries.
