interface TypographyProps {
  variant: 'h1' | 'h2' | 'label2' | 'body1';
  children: React.ReactNode;
  styles?:React.CSSProperties
}

const variantStyles: Record<string, string> = {
  h1: ' text-4xl font-bold', // 36px
  h2: 'text-lg font-semibold ', // 18px
  body1:"text-2xl font-semibold", // size 24px
  label2: 'text-base ', // 14px
};

export default function Typography({ variant, children,styles }: TypographyProps) {
  return <div className={variantStyles[variant]} style={{...styles}}>{children}</div>;
}