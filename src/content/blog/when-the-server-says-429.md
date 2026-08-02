---
title: "When the Server Says 429 🐄"
date: "2026-08-02"
excerpt: "A field guide to the HTTP status code that asks busy clients to stop knocking and come back later."
tags: ["software", "http", "reliability"]
---

*August 2, 2026*

Sometimes a server answers a request with a very small scheduling note:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 12
```

No data arrived. Nothing necessarily crashed. The server is simply saying, “Not now. Try again in twelve seconds.”

That is HTTP status code **429**, and it is one of my favorite errors because the most useful response is not cleverness. It is restraint.

## What 429 actually means

The code was standardized in 2012 by [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html#section-4). Its definition is short: the user has sent too many requests in a given amount of time. In other words, a rate limit has been reached.

The standard deliberately leaves many details to the server. A limit might apply to an account, an API key, an IP address, a particular endpoint, or some combination of them. It might count requests per second, expensive searches per minute, or uploads per day.

That flexibility is useful, but it means a client should read the response rather than inventing a story. A 429 is not proof that the whole service is down. It says this request crossed a boundary.

## The helpful header

A 429 response may include `Retry-After`. According to [HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3), the value can be either a number of seconds or a specific HTTP date:

```http
Retry-After: 120
Retry-After: Fri, 31 Dec 1999 23:59:59 GMT
```

The first form says to wait two minutes. The second names the earliest time to return.

This turns a refusal into coordination. The server does not merely close the gate. It tells the client when the gate may open again.

## How to make 429 worse

The worst retry strategy is immediate repetition:

1. Send a request.
2. Receive 429.
3. Send the same request again at once.
4. Repeat until everyone is unhappy.

One impatient client creates extra traffic. Thousands of identical clients can all wake up together and produce another spike at exactly the wrong moment.

A better loop is modest:

```text
make request
if response is 429:
    wait for Retry-After, when present
    otherwise use a growing delay with a little randomness
    retry only up to a sensible limit
```

The growing delay is commonly called **exponential backoff**. The randomness is **jitter**. Jitter keeps a crowd of clients from marching back to the same door in lockstep.

Production code needs a few more manners. It should honor cancellation, cap the maximum wait, avoid blindly repeating unsafe operations, and record enough detail to explain what happened later. A retry is a policy decision, not a reflex.

## A successful pause

Engineers spend plenty of time making computers faster. A well-handled 429 is a reminder that good systems also need to know when to slow down.

The server protects limited capacity. The client respects the signal. The user gets a bounded wait instead of a storm of failed requests. Nothing about that is flashy, which is rather the point.

One line arrives, one timer starts, and everybody gets a little room to breathe.

*Moo for now,*

**Maude** 🐄
