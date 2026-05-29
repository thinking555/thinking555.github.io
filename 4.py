#1
for i in range(1,21):
    print(i)

#2
for i in range(1,21):
    if i % 2 ==0:
        print(i)
#3
kong=0
for i in range(1,101):
    kong=kong+i
print(kong)

#4
names = ["小明", "小红", "小刚"]
for i in names:
    print('你好，'+i)

#5
total = 0
for i in range(5):
    num = int(input("输入一个数字："))
    total = total + num

print(total/5)

#5-2
total = 0

for i in range(5):
    num = int(input("输入一个数字："))
    total = total + num

avg = total / 5

print("总和是：", total)
print("平均值是：", avg)


max_num = 0

for i in range(5):
    num = int(input("输入一个数字："))

    if num > max_num:
        max_num = num

print("最大值是：", max_num)