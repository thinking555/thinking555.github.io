i=1
while i<=10:
    print(i)
    i=i+1

i=1
while i<=20:
    if i%2==0:
        print(i)
    i=i+1

a=0
b=0
while True:
    n=int(input('输入数字：'))
    b=n+b
    if n==a:
        print('正确')
        break
print(b)

a=123456
while True:
    n=int(input('输入数字：'))
    if n==a:
        print('正确')
        break
    else:
        print('密码错误，重新输入')

max=0
while True:
    n=int(input('输入数字：'))
    if n>max:
        max=n
    if n=-1:
        break
