import { Burger } from '@mantine/core';
import { Drawer, Group, Stack, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import React from 'react';

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string;
    href: string;
    isActive: boolean;
    disabled?: boolean;
  }[];
};

export function TopNav({ links, ...props }: TopNavProps) {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      {/* MOBILE */}
      <Group className="lg:hidden" justify="space-between">
        <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />

        <Drawer opened={opened} onClose={close} title="Navigation" padding="md" size="sm">
          <Stack gap="sm">
            {links.map((link) => {
              const disabled = !!link.disabled;

              return (
                <UnstyledButton
                  key={link.title + link.href}
                  onClick={close}
                  disabled={disabled}
                  style={{
                    opacity: disabled ? 0.5 : link.isActive ? 1 : 0.7,
                    pointerEvents: disabled ? 'none' : 'auto',
                  }}
                >
                  <Link
                    to={link.href}
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: link.isActive ? 'var(--mantine-color-primary-6)' : 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    {link.title}
                  </Link>
                </UnstyledButton>
              );
            })}
          </Stack>
        </Drawer>
      </Group>

      {/* DESKTOP */}
      <Group className={['hidden lg:flex'].filter(Boolean).join(' ')} {...props} gap="md">
        {links.map((link) => {
          const disabled = !!link.disabled;

          return (
            <Link
              key={link.title + link.href}
              to={link.href}
              style={{
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                color: disabled
                  ? 'var(--mantine-color-gray-5)'
                  : link.isActive
                    ? 'var(--mantine-color-primary-6)'
                    : 'var(--mantine-color-gray-7)',
                pointerEvents: disabled ? 'none' : 'auto',
                opacity: disabled ? 0.5 : 1,
                transition: 'color 0.2s ease',
              }}
            >
              {link.title}
            </Link>
          );
        })}
      </Group>
    </>
  );
}
