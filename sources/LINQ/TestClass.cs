using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Collections.Generic;

namespace Test
{
    [TestClass]
    public class TestClass
    {
        [TestMethod]
        public void TestMethod()
        {
            MinhaClasse m = new MinhaClasse();
            m.outerVar = 2;
            m.Extensao(5);
            Assert.AreEqual(m.outerVar, 7);
        }

        [TestMethod]
        public void HasLinqExtensions()
        {
            int[] arr = { 1, 2, 3, 4, 5 };
            IEnumerable<int> enumerable = arr;

            var result = enumerable.Where(i => i < 4); // => IEnumerable contendo { 1, 2, 3 };
        }

        [TestMethod]
        public void BuildComplexQuery()
        {
            string[] arr = { "Alice", "Bob", "Charlie" };

            var result = arr.Where(s => !s.StartsWith("A"))
                .Where(s => s.Length < 5)
                .Select(s => new { Name = s });

            foreach (var item in result)
            {
                Console.WriteLine(item.Name);
            }
        }

        public void QuerySyntax()
        {
            int[] arr = { 1, 2, 3, 4, 5 };
            IEnumerable<int> enumerable = arr;

            var result = from i in enumerable
                         where i < 4
                         select i;
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void QuerySyntaxWorksByDuckTyping()
        {
            LinqFooler fooler = new LinqFooler(new int[] { 1, 2, 3, 4, 5 });
            var result = from i in fooler
                         where i < 4
                         select i;
            Assert.AreEqual(null, result);
            Assert.AreEqual(5, fooler.Count()); // outros metodos nao sao afetados
            result.Count(); // atira ArgumentNullException, Count() recebe null de result.Where()
        }
    }

}
