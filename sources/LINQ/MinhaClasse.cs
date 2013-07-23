using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test
{
    class MinhaClasse
    {
        protected int innerVar; // Invisivel para outras classes
        internal int outerVar; // Visivel para outras classes da mesma assembly
    }
}
