---
layout: post
tagline: "O under-the-hood do componente para consultas da plataforma .NET"
tags: [linq, entity framework, extension methods, avan&ccedil;ado]
title: "LINQ - O que realmente &eacute;"
---

# Introdução

Vamos começar a primeira parte da série sobre **LINQ** falando sobre o que é a linguagem criada pela Microsoft para seleção de dados a partir de coleções.

# Origens do LINQ

O **LINQ** (**L**anguage **IN**tegrated **Q**uery -- Consulta Integrada &agrave; Linguagem) foi introduzido na plataforma .NET versão 3.5 a fim de tornar-se uma linguagem capaz de fornecer uma interface padrão para consultas a qualquer coleção, desde simples `Array`s e `List<>`s até objetos manipulados por componentes como a [Entity Framework] que podem por sua vez gerar consultas traduzidas para outras linguagens como SQL.

[Entity Framework]:http://msdn.microsoft.com/en-us/data/ef.aspx

Em outros blogs é possível ver exemplos e aprender a utilização básica dessa linguagem. O objetivo desta série é fazer com que você possa saber um pouco melhor como esse esse recurso realmente funciona e foi implementado, e portanto como utilizá-lo de maneira rápida e com segurança.

# Sintaxe de Consulta vs Sintaxe de Método

As duas sintaxes para a utilização do LINQ são equivalentes, porém algumas operações podem ser mais simples ou elegantes de se implementar utilizando uma delas.

O compilador do C# converte ambas ao mesmo resultado (equivalente &agrave; sintaxe de método, conforme veremos a seguir), portanto a escolha muitas vezes se resume a estilística.

## Sintaxe de Método (Method Syntax)

A **Sintaxe de Método** involve a utilização dos Métodos de Extensão disponibilizados em `System.Linq`, como `IEnumerable<T>.Where()`:

{% highlight csharp %}
using System.Linq;

// ...

public void HasLinqExtensions()
{
    int[] arr = { 1, 2, 3, 4, 5 };
    IEnumerable<int> enumerable = arr;

    var result = enumerable.Where(i => i < 4); // => IEnumerable contendo { 1, 2, 3 };
}
{% endhighlight %}

Esse exemplo também utiliza [lambda expressions], que são essencialmente uma maneira curta de criar uma função anônima, possibilitando uma sintaxe limpa para programação similar &agrave; de linguagens funcionais.

[lambda expressions]:http://msdn.microsoft.com/en-us/library/vstudio/bb397687.aspx

A construção de queries complexas é feita através de chamadas em corrente. As expressões são avaliadas preguiçosamente (de maneira *lazy*), ou seja, somente quando necessário:

{% highlight csharp %}
public void BuildComplexQuery()
{
    string[] arr = { "Alice", "Bob", "Charlie" };

    var result = arr.Where(s => !s.StartsWith("A"))
        .Where(s => s.Length < 5)
        .Select(s => new { Name = s });

    foreach (var item in result) // avalia o proximo item somente a cada iteracao
    {
        Console.WriteLine(item.Name);
    }

    Assert.AreEqual("Bob", result.First().Name)
}
{% endhighlight %}

## Sintaxe de Consulta (Query Syntax)

A **Sintaxe de Consulta** é nova sintaxe implementada pelo C# que possibilita a manipulação de consultas como se fossem **cidadãos de primeira classe** da linguagem, isso quer dizer, como se fossem outras construções nativas da linguagem como instâncias de classes e tipos de valor.

A seguir está o primeiro exemplo acima reescrito na sintaxe de consulta:

{% highlight csharp %}
public void QuerySyntax()
{
    int[] arr = { 1, 2, 3, 4, 5 };
    IEnumerable<int> enumerable = arr;

    var result = from i in enumerable
                 where i < 4
                 select i;
}
{% endhighlight %}

### Duck Typing

Como a sintaxe de consulta não é nada além de uma maneira diferente de executar os métodos definidos pelo LINQ, o compilador C# simplesmente substitui as palavras chave por chamadas a métodos com os nomes correspondentes (`Where()`, `Select`, etc.), sem necessariamente estes vindo de `Sistem.Linq`. Por se tratarem de métodos de extensão, o compilador não tem como fazer essa confirmação.

E é aqui que começamos a ver melhor como o LINQ funciona *under the hood*, pois caso sua classe exponha um método com o mesmo nome de alguma outra forma ele será chamado no lugar do método LINQ:

{% highlight csharp %}
class LinqFooler : List<int>
{
    public LinqFooler(IEnumerable<int> collection)
        :base(collection) {}

    public IEnumerable<int> Where(Func<int, bool> filter)
    {
        Console.WriteLine("Haha");
        return null;
    }
}

// ...

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
{% endhighlight %}

Não se preocupe em entender o parâmetro <span class="highlight"><code class="csharp">{% highlight csharp nowrap %}Func<int, bool> filter{% endhighlight %}</code></span>&nbsp;por enquanto, abordaremos melhor como implementar nossos próprios métodos em outro post. O importante é perceber que de fato o compilador simplesmente gerou uma chamada equivalente a <span class="highlight"><code class="csharp">{% highlight csharp nowrap %}fooler.Where(i => i < 4){% endhighlight %}</code></span>, que resolveu para o método `LinqFooler#Where`.

Isso é comum em linguagens fracamente tipadas e é chamado *duck typing*, que é o polimorfismo resultante da resolução da chamada de métodos baseado somente em seus nomes e assinaturas, sem a necessidade de herdar de uma mesma classe base ou implementar uma mesma interface, como é o caso do **C#**.

# Extension Methods

Finalmente, outro novo recurso criado justamente para que fosse possível a existência do **LINQ** foram os **Extension Methods**, ou **Métodos de Extensão**, que possibilitam "adicionar" métodos a uma classe de forma transparente.

Eles atendem ao caso de uso comum de criar um médodo estático para interagir com determinada classe sem modificá-la internamente, quando muitas vezes o desejo do programador seria mesmo o de modificar a classe.

{% highlight csharp %}
class MinhaClasse
{
    protected int innerVar; // Invisivel para outras classes
    internal int outerVar; // Visivel para outras classes da mesma assembly
}

static class MinhaClasseExtensao
{
    static public void Extensao(this MinhaClasse target, int sum)
    {
        target.outerVar += sum;
    }
}

[TestClass]
public class TestClass
{
    [TestMethod]
    public void TestMethod()
    {
        MinhaClasse m = new MinhaClasse();
        m.outerVar = 2;
        m.Extensao(5);
        Assert.AreEqual(7, m.outerVar);
    }
}
{% endhighlight %}

Foi exatamente esse mesmo o cenário enfrentado pelo pessoal da .NET, eles tinham que ampliar as funcionalidades de interfaces antigas (`IEnumerable<>`, `ICollection<>`, `IList<>`, etc.) mantendo a retro-compatibilidade e sem alterar o código das implementações existentes.

# Restante da série

Este é o fim do primeiro post em minha série sobre LINQ, nos próximos posts exploraremos melhor o conceito dos métodos de extensão, expressões lambda, vamos ver paralelos com a origem da sintaxe em linguagens funcionais, outras implementações como Linq-to-Entities e vamos reimplementar nossa própria versão simplificada do LINQ.
