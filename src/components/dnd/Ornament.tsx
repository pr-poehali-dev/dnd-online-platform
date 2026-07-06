import Icon from '@/components/ui/icon';

export const Divider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
    <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
    <Icon name="Diamond" size={14} className="text-primary" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
  </div>
);

export const Panel = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`gold-border rounded-lg p-5 shadow-xl relative ${className}`}
  >
    {children}
  </div>
);

export default Divider;
