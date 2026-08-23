import re

file_path = "app/portals/creator/page.tsx"

with open(file_path, "r") as f:
    lines = f.readlines()

new_lines = []
in_head = False
in_incoming = False

for line in lines:
    if line.startswith("<<<<<<< HEAD"):
        in_head = True
        continue
    elif line.startswith("======="):
        in_head = False
        in_incoming = True
        continue
    elif line.startswith(">>>>>>>"):
        in_incoming = False
        continue
    
    if in_incoming:
        continue
    
    new_lines.append(line)

content = "".join(new_lines)

# Replace hardcoded text-white with text-[var(--text)]
content = re.sub(r'\btext-white\b', 'text-[var(--text)]', content)
content = re.sub(r'text-gray-400', 'text-[var(--muted)]', content)

# Oklch to variables
replacements = {
    r'bg-\[oklch\(0\.12_0\.01_80\)\]': 'bg-[var(--black)]',
    r'bg-\[oklch\(0\.1_0\.01_80\)\]': 'bg-[var(--black)]',
    
    r'bg-\[oklch\(0\.15_0\.02_80\)\]': 'bg-[var(--card)]',
    r'bg-\[oklch\(0\.16_0\.02_80\)\]': 'bg-[var(--card)]',
    r'bg-\[oklch\(0\.11_0\.01_80\)\]': 'bg-[var(--card)]',
    r'bg-\[oklch\(0\.14_0\.02_80\)\]': 'bg-[var(--card)]',
    r'bg-\[oklch\(0\.18_0\.02_80\)\]': 'bg-[var(--card)]',
    
    r'border-\[oklch\(0\.25_0\.02_80\)\]': 'border-[var(--border)]',
    r'border-\[oklch\(0\.22_0\.02_80\)\]': 'border-[var(--border)]',
    r'border-\[oklch\(0\.2_0\.02_80\)\]': 'border-[var(--border)]',
    r'border-\[oklch\(0\.3_0\.02_80\)\]': 'border-[var(--border2)]',
    r'border-\[oklch\(0\.28_0\.02_80\)\]': 'border-[var(--border2)]',
    
    r'text-\[oklch\(0\.8_0\.16_75\)\]': 'text-[var(--amber)]',
    r'bg-\[oklch\(0\.8_0\.16_75\)\]': 'bg-[var(--amber)]',
    r'hover:bg-\[oklch\(0\.85_0\.16_75\)\]': 'hover:opacity-90',
    r'hover:border-\[oklch\(0\.8_0\.16_75\)\]': 'hover:border-[var(--amber)]',
    
    r'text-\[oklch\(0\.68_0\.015_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.62_0\.015_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.6_0\.015_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.55_0\.01_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.5_0\.01_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.75_0\.01_85\)\]': 'text-[var(--muted)]',
    r'text-\[oklch\(0\.85_0\.01_85\)\]': 'text-[var(--muted2)]',
    r'text-\[oklch\(0\.9_0\.01_85\)\]': 'text-[var(--text)]',
    
    r'bg-\[oklch\(0\.8_0\.16_75_/_0\.1\)\]': 'bg-[var(--amber)]/10',
    r'border-\[oklch\(0\.8_0\.16_75_/_0\.2\)\]': 'border-[var(--amber)]/20',
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open(file_path, "w") as f:
    f.write(content)

print("Successfully resolved conflicts and updated styling.")
