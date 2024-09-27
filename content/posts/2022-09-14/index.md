---
title: "素数判定法"
date: 2022-09-14T20:50:09+09:00
categories:
- 
tags:
- 
comments:       false
showMeta:       true
showActions:    false
draft: true
---

素数かどうかを判定するには、いくつかの方法があります。

### 暴力法

暴力法とは、2から順に数を割り、割り切れなければ素数であると判定する方法です。次のようなコードを書くことで実装できます。

```julia
function isprime(n::Int)
    if n < 2
        return false
    end
    for i = 2:n-1
        if n % i == 0
            return false
        end
    end
    return true
end
```

ただし、暴力法では時間がかかるため、大きな数を判定する場合には非常に遅くなります。

### ミラー・ラビン素数判定法

これは、数が素数であるかを判定するアルゴリズムです。次のようなコードを書くことで実装できます。

```julia
function isprime(n::Int)
    if n <= 1
        return false
    end
    if n == 2 || n == 3
        return true
    end
    if n % 2 == 0 || n % 3 == 0
        return false
    end
    i = 5
    w = 2
    while i * i <= n
        if n % i == 0
            return false
        end
        i += w
        w = 6 - w
    end
    return true
end
```

### べき乗法による素数判定法

これは、素数を判定するアルゴリズムです。次のようなコードを書くことで実装できます。

```julia
function isprime(n::Int)
    if n < 2
        return false
    end
    if n == 2 || n == 3
        return true
    end
    if n % 2 == 0 || n % 3 == 0
        return false
    end
    i = 5
    w = 2
    while i * i <= n
        if n % i == 0
            return false
        end
        i += w
        w = 6 - w
    end
    return true
end
```

### エラトステネスの篩

エラトステネスの篩では、素数であるかを判定する前に、n以下の素数を求めるため、暴力法や素数判定法よりも時間がかかりますが、n以下の素数を求めることができるため、素数を多数求める場合には効率的です。

```julia
function primes(n::Int)
    # n以下の素数を求める
    is_prime = trues(n + 1)
    is_prime[1] = false
    for i = 2:n
        if is_prime[i]
            for j = i * 2:n, i
                is_prime[j] = false
            end
        end
    end
    primes = Int[]
    for i = 1:n
        if is_prime[i]
            push!(primes, i)
        end
    end
    primes
end

function isprime(n::Int)
    if n < 2
        return false
    end
    primes = primes(n)
    return n in primes
end
```

どのアルゴリズムを使用するかは、利用するシーンやニーズに応じて決める必要があります。