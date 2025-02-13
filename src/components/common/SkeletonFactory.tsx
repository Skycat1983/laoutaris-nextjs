import { ReactNode, ComponentType } from "react";

interface SkeletonFactoryProps {
  Layout: ComponentType<{ children: ReactNode }>;
  Card: ComponentType;
  count: number;
}

export const SkeletonFactory = ({
  Layout,
  Card,
  count,
}: SkeletonFactoryProps) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <Layout>
      {items.map((_, index) => (
        <Card key={index} />
      ))}
    </Layout>
  );
};
