using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test
{
    class LinqFooler : List<int>
    {
        public LinqFooler(IEnumerable<int> collection)
            : base(collection) { }

        public IEnumerable<int> Where(Func<int, bool> filter)
        {
            Console.WriteLine("Haha");
            return null;
        }
    }
}
