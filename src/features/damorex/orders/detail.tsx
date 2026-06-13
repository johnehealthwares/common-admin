import {
  Badge,
  Box,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Timeline,
} from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { Package, MapPin, CreditCard, Truck, Check } from 'lucide-react';
import { EmptyOrders } from '../website/empty-states';
import { useOrder } from '../website/hooks';
import { WebsiteLayout, green, ink, muted, line } from '../website/layout';
import { PageLoader } from '../website/loaders';

const statusColors: Record<string, string> = {
  Pending: 'yellow',
  Confirmed: 'blue',
  Processing: 'violet',
  Dispatched: 'orange',
  'In Transit': 'cyan',
  Delivered: 'green',
  Cancelled: 'red',
};

export default function OrderDetailPage() {
  const { id } = useParams({ from: '/damorex/orders_/$id' });
  const { data: order, isLoading } = useOrder(id);

  return (
    <WebsiteLayout>
      <Container size="md" py={{ base: 28, md: 48 }}>
        {isLoading ? (
          <PageLoader />
        ) : !order ? (
          <EmptyOrders
            title="Order not found"
            message="We couldn't find an order with that ID. It may have been removed or the link may be incorrect."
          />
        ) : (
          <Stack gap="xl">
            <Box>
              <Group gap="sm">
                <Title order={1} className="damorex-heading" style={{ color: ink }}>
                  Order {order.code || `#${order.id.slice(0, 8)}`}
                </Title>
                <Badge size="lg" radius="xl" color={statusColors[order.status] || 'gray'}>
                  {order.status}
                </Badge>
              </Group>
              <Text c={muted} size="sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </Box>

            <Paper radius={24} p="xl" withBorder style={{ borderColor: line }}>
              <Title order={3} className="damorex-heading" mb="md">
                Delivery Details
              </Title>
              <Stack gap="sm">
                <Group gap={8}>
                  <MapPin size={18} color={green} />
                  <Text>
                    {order.deliveryAddress}
                    {order.city ? `, ${order.city}` : ''}
                    {order.state ? `, ${order.state}` : ''}
                  </Text>
                </Group>
                {order.paymentMethod ? (
                  <Group gap={8}>
                    <CreditCard size={18} color={green} />
                    <Text>{order.paymentMethod}</Text>
                  </Group>
                ) : null}
              </Stack>
            </Paper>

            <Paper radius={24} p="xl" withBorder style={{ borderColor: line }}>
              <Title order={3} className="damorex-heading" mb="md">
                Order Timeline
              </Title>
              <Timeline active={3} bulletSize={24} lineWidth={2}>
                <Timeline.Item bullet={<Package size={12} />} title="Order Placed">
                  <Text size="sm" c={muted}>
                    {new Date(order.createdAt).toLocaleString()}
                  </Text>
                </Timeline.Item>
                <Timeline.Item bullet={<Check size={12} />} title="Confirmed" />
                <Timeline.Item bullet={<Truck size={12} />} title="Processing" />
                <Timeline.Item bullet={<MapPin size={12} />} title="Dispatched" />
              </Timeline>
            </Paper>

            {order.lines?.length ? (
              <Paper radius={24} p="xl" withBorder style={{ borderColor: line }}>
                <Title order={3} className="damorex-heading" mb="md">
                  Items
                </Title>
                <Stack gap="sm">
                  {order.lines.map((line) => (
                    <Group key={line.id} justify="space-between">
                      <Text>
                        {line.productId ? `Product #${line.productId.slice(0, 8)}` : 'Item'}
                      </Text>
                      <Group gap="md">
                        <Text c={muted}>x{line.quantity}</Text>
                        <Text fw={800}>₦{line.unitPrice?.toLocaleString() || 0}</Text>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        )}
      </Container>
    </WebsiteLayout>
  );
}
