#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
css_flatten.py - 将嵌套 CSS 转换为传统扁平格式

用法:
    python3 css_flatten.py input.css output.css
"""

import sys
import re


# ---------------- 词法层：去掉注释、保留字符串 ----------------

def strip_comments(text: str) -> str:
    """移除 /* ... */ 注释，但保留字符串中的内容。"""
    result = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        # 字符串
        if ch in ('"', "'"):
            quote = ch
            result.append(ch)
            i += 1
            while i < n:
                c = text[i]
                result.append(c)
                if c == '\\' and i + 1 < n:
                    result.append(text[i + 1])
                    i += 2
                    continue
                if c == quote:
                    i += 1
                    break
                i += 1
            continue
        # 注释
        if ch == '/' and i + 1 < n and text[i + 1] == '*':
            end = text.find('*/', i + 2)
            if end == -1:
                break  # 未闭合注释，丢弃
            i = end + 2
            continue
        result.append(ch)
        i += 1
    return ''.join(result)


# ---------------- 语法层：解析成嵌套结构 ----------------

class Node:
    """一个块节点：prelude 可能是选择器或 @规则。"""
    __slots__ = ('prelude', 'children', 'declarations')

    def __init__(self, prelude: str):
        self.prelude = prelude          # 如 ".card" 或 "@media (...) "
        self.children: list['Node'] = []  # 子块
        self.declarations: list[str] = [] # 声明（"color: red"）


def split_top_level(text: str, sep: str = ';') -> list[str]:
    """按顶层分隔符切分，忽略括号/引号内的分隔符。"""
    parts = []
    buf = []
    depth = 0
    i = 0
    n = len(text)
    while i < n:
        c = text[i]
        if c in ('"', "'"):
            quote = c
            buf.append(c)
            i += 1
            while i < n:
                buf.append(text[i])
                if text[i] == '\\' and i + 1 < n:
                    buf.append(text[i + 1])
                    i += 2
                    continue
                if text[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
        if c == sep and depth == 0:
            parts.append(''.join(buf))
            buf = []
        else:
            buf.append(c)
        i += 1
    if buf:
        parts.append(''.join(buf))
    return parts


def parse(text: str) -> list[Node]:
    """把 CSS 文本解析成 Node 列表（顶层）。"""
    roots: list[Node] = []
    stack: list[Node] = []          # 当前打开的块
    buf: list[str] = []             # 累积字符

    i = 0
    n = len(text)

    def current_decls():
        return stack[-1].declarations if stack else None

    while i < n:
        c = text[i]

        # 字符串原样吞
        if c in ('"', "'"):
            quote = c
            buf.append(c)
            i += 1
            while i < n:
                buf.append(text[i])
                if text[i] == '\\' and i + 1 < n:
                    buf.append(text[i + 1])
                    i += 2
                    continue
                if text[i] == quote:
                    i += 1
                    break
                i += 1
            continue

        if c == '{':
            prelude = ''.join(buf).strip()
            buf = []
            node = Node(prelude)
            if stack:
                stack[-1].children.append(node)
            else:
                roots.append(node)
            stack.append(node)
            i += 1
            continue

        if c == '}':
            # 处理剩余声明
            leftover = ''.join(buf).strip()
            buf = []
            if leftover and stack:
                stack[-1].declarations.append(leftover)
            if stack:
                stack.pop()
            i += 1
            continue

        if c == ';':
            decl = ''.join(buf).strip()
            buf = []
            if decl and stack:
                stack[-1].declarations.append(decl)
            i += 1
            continue

        buf.append(c)
        i += 1

    # 顶层残余（理论上不该有）
    leftover = ''.join(buf).strip()
    if leftover:
        roots.append(Node(''))  # 视为游离声明，忽略
        roots[-1].declarations.append(leftover)

    return roots


# ---------------- 选择器组合 ----------------

def split_selectors(sel: str) -> list[str]:
    """按逗号拆分选择器列表（忽略括号内逗号）。"""
    parts = []
    buf = []
    depth = 0
    for c in sel:
        if c == '(':
            depth += 1
        elif c == ')':
            depth -= 1
        if c == ',' and depth == 0:
            parts.append(''.join(buf).strip())
            buf = []
        else:
            buf.append(c)
    if buf:
        parts.append(''.join(buf).strip())
    return [p for p in parts if p]


def combine(parents: list[str], child: str) -> list[str]:
    """把父选择器列表和子选择器组合。"""
    result = []
    for child_sel in split_selectors(child):
        if '&' in child_sel:
            for p in parents:
                result.append(child_sel.replace('&', p))
        else:
            for p in parents:
                result.append(f"{p} {child_sel}")
    return result


# ---------------- 序列化 ----------------

def indent_of(depth: int) -> str:
    return '  ' * depth


def emit(node: Node, parent_selectors: list[str], depth: int, out: list[str]):
    """递归输出扁平 CSS。"""
    prelude = node.prelude.strip()

    # 1) at-rule（@media / @supports / @font-face / @keyframes 等）
    if prelude.startswith('@'):
        # @font-face / @keyframes 这种内部就是声明或关键帧块
        # 这里简单处理：直接原样块输出，不做选择器组合
        out.append(f"{indent_of(depth)}{prelude} {{")
        # 声明
        for d in node.declarations:
            out.append(f"{indent_of(depth + 1)}{d};")
        # 子块（@media 里可能有规则，@keyframes 里有 0%/100%）
        for child in node.children:
            emit_atrule_child(child, depth + 1, out)
        out.append(f"{indent_of(depth)}}}")
        return

    # 2) 普通规则块
    # 计算自己的选择器
    if parent_selectors and prelude:
        my_selectors = combine(parent_selectors, prelude)
    elif prelude:
        my_selectors = split_selectors(prelude)
    else:
        my_selectors = parent_selectors[:]  # 不太常见

    # 输出该块的声明
    if node.declarations:
        if my_selectors:
            out.append(f"{indent_of(depth)}{', '.join(my_selectors)} {{")
        else:
            # 没有选择器但有声明（顶层游离声明）
            out.append(f"{indent_of(depth)}{{")
        for d in node.declarations:
            out.append(f"{indent_of(depth + 1)}{d};")
        out.append(f"{indent_of(depth)}}}")

    # 输出子块
    for child in node.children:
        emit(child, my_selectors, depth, out)


def emit_atrule_child(node: Node, depth: int, out: list[str]):
    """at-rule 内部的子块。选择器不跟外层组合（@media 内是新的根）。"""
    prelude = node.prelude.strip()
    if prelude.startswith('@'):
        out.append(f"{indent_of(depth)}{prelude} {{")
        for d in node.declarations:
            out.append(f"{indent_of(depth + 1)}{d};")
        for child in node.children:
            emit_atrule_child(child, depth + 1, out)
        out.append(f"{indent_of(depth)}}}")
    else:
        # 普通规则块，选择器从头开始
        my_selectors = split_selectors(prelude)
        if node.declarations:
            out.append(f"{indent_of(depth)}{', '.join(my_selectors)} {{")
            for d in node.declarations:
                out.append(f"{indent_of(depth + 1)}{d};")
            out.append(f"{indent_of(depth)}}}")
        for child in node.children:
            emit(child, my_selectors, depth, out)


# ---------------- 主流程 ----------------

def flatten(css_text: str) -> str:
    clean = strip_comments(css_text)
    roots = parse(clean)
    out: list[str] = []
    for node in roots:
        emit(node, [], 0, out)
    return '\n'.join(out) + '\n'


def main():
    if len(sys.argv) != 3:
        print(f"用法: {sys.argv[0]} [输入文件] [输出文件]", file=sys.stderr)
        sys.exit(1)

    in_path, out_path = sys.argv[1], sys.argv[2]
    with open(in_path, 'r', encoding='utf-8') as f:
        css = f.read()

    result = flatten(css)

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(result)

    print(f"转换完成: {in_path} -> {out_path}")


if __name__ == '__main__':
    main()
