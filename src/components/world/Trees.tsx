import { TREE_CONFIGS } from '@/constants/world';
import Tree from './Tree';

export default function Trees() {
  return (
    <>
      {TREE_CONFIGS.map((config, i) => (
        <Tree key={i} config={config} />
      ))}
    </>
  );
}
