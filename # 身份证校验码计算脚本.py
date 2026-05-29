# 身份证校验码计算脚本
# 标准：ISO 7064:1983.MOD 11-2

def calculate_id_check_code(id17: str) -> str:
    """
    根据身份证前17位计算第18位校验码
    :param id17: 身份证前17位数字
    :return: 校验码，可能是 0-9 或 X
    """

    # 校验输入
    if len(id17) != 17:
        raise ValueError("请输入身份证前17位数字")

    if not id17.isdigit():
        raise ValueError("身份证前17位必须全部是数字")

    # 加权因子
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

    # 余数对应校验码
    check_codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    # 计算加权和
    total = 0
    for i in range(17):
        total += int(id17[i]) * weights[i]

    # 对11取模
    remainder = total % 11

    # 返回校验码
    return check_codes[remainder]


def generate_full_id(id17: str) -> str:
    """
    根据前17位生成完整18位身份证号
    """
    check_code = calculate_id_check_code(id17)
    return id17 + check_code


if __name__ == "__main__":
    id17 = input("请输入身份证前17位数字：").strip()

    try:
        check_code = calculate_id_check_code(id17)
        full_id = generate_full_id(id17)

        print("校验码是：", check_code)
        print("完整身份证号是：", full_id)

    except ValueError as e:
        print("错误：", e)