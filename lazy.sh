#!/bin/bash
cat src/App.tsx | grep "import .* from \"./components/.*\"" | sed 's/import \(.*\) from "\(.*\)";/const \1 = React.lazy(() => import("\2"));/g'
