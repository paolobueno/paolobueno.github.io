using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test
{
    static class MinhaClasseExtensao
    {
        static public void Extensao(this MinhaClasse target, int sum)
        {
            target.outerVar += sum;
        }
    }
}
