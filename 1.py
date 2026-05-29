secret_number = 7
guess = int(input("猜猜我想的是哪个数字（1-10）："))

if guess == secret_number:
    print(“猜对了”)
elif guess < secret_number:
    print(“猜小了”)
else:
    print("猜大了")