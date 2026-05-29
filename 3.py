for i in range(1, 11):
    if i % 2 == 0:
        print(i)

total = 0

for i in range(1, 6):
    total = total + i

print(total)


total = 0

for i in range(5):
    num = int(input("输入一个数字："))
    total = total + num

print("总和是：", total)